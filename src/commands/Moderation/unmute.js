
const { EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription(`Убрать Тайм-аут цели.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("target").setDescription("Кого разамутить").setRequired(true)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;
    const user = options.getUser("target");
    const member = guild.members.cache.get(user.id);
    const errEmbed = new EmbedBuilder()
      .setDescription("Что-то не так, Попробуйте снова")
      .setColor(0xf16680);
    const succEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${user.tag} был размучен`,
        iconURL: user.displayAvatarURL({dynamic:true}),
      }).setDescription(`<@${member.id}> Успешно размучен`)
      .setColor(0xffc6aa)
      .setFooter({ text: `Модератор: ${interaction.member.user.tag}` })
      .setTimestamp();
    if (
      member.roles.highest.positon >= interaction.member.roles.highest.positon
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers
      )
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    try {
      await member.timeout(null);
      interaction.reply({embeds:[succEmbed]})
    } catch (error) {
    console.log(error);
    }
  },
};
