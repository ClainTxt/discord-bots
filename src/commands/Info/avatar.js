const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Посмотреть аватарку свою/пользователя")
        .addUserOption((o) => o.setName("пользователь").setDescription("Укажите пользователя")),
    async execute(interaction, client) {
        const { options, user, member, guild, guildId } = interaction;
        const target = options.getUser("пользователь") || member;
        const avatar = target.displayAvatarURL({ dynamic: true, size: 512 });
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Ссылка").setURL(avatar).setStyle(ButtonStyle.Link)
        );
        const embed = new EmbedBuilder()
            .setAuthor({
                name: target.tag || (member.nickname || member.tag),
                iconURL:
                    target.displayAvatarURL({ dynamic: true }) ||
                    member.displayAvatarURL({ dynamic: true }),
            })
            .setImage(avatar)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            });
        return interaction.reply({ embeds: [embed], components: [button] });
    },
};
