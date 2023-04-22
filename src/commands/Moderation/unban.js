const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Разбанить пользователя")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("userid")
            .setDescription("Discord ID of the user you want to unban.")
            .setRequired(true)
    ),
  async execute(interaction) {
    const { channel, options } = interaction;
    const userId = options.getString("userid");
    try {
      await interaction.guild.members.unban(userId);
      const embed = new EmbedBuilder()
        .setDescription(`Успешно разбанен: <@${userId}>`)
        .setColor(0x00ff5e)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      const errEmbed = new EmbedBuilder()
        .setColor(0x00ff5e)
        .setTimestamp()
        .setDescription("Неккоректный Discord ID");
      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
