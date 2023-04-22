const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Кикнуть пользователя.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Пользователь которого нужно кикнуть")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Причина кика")
    ),

  async execute(interaction) {
    const { channel, options } = interaction;
    const user = options.getUser("target");
    const reason = options.getString("reason") || `Не указана`;
    const member = await interaction.guild.members.fetch(user.id);
    const errEmbed = new EmbedBuilder()
      .setTitle(
        `Вы не можете принять меры над ${user.username} пока его роль выше.`
      )
      .setColor(0xFF0015);
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    await member.kick(reason);
    const embed = new EmbedBuilder().setDescription(
      `Успешно кикнут ${user} с причиной: \`${reason}\``
    ).setColor(0x00FF5E).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
