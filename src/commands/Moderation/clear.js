const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, PermissionsBitField, CommandInteraction } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Удаления специального количества сообщений у цели или в канале")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription("Количество сообщений для удаления")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('target')
                .setDescription("Выберите цель для удаления его сообщений")
                .setRequired(false)
        ),
    async execute(interaction) {

        const { channel, options, member } = interaction;
        const amount = options.getInteger('amount');
        const target = options.getUser('target')
        const messages = await channel.messages.fetch({
            limit: amount + 1,
        })
        const res = new EmbedBuilder()
            .setColor(0x5fb041)

        if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({ content: "У вас нет прав, для использования этой комманды", ephemeral: true })
        if (target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Успешно удалено ${messages.size} сообщений у ${target}`)
                interaction.reply({ embeds: [res], ephemeral: true });
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages =>{
                res.setDescription(`Успешно ${messages.size} сообщений в канале`)
                interaction.reply({ embeds: [res], ephemeral: true });
            })
        }
    }
}