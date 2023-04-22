const { EmbedBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  Message,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription(`Тайм-аут цели.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("target").setDescription("Кого замутить").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Время на которое тайм-аут")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Причина").setRequired(false)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;
    const user = options.getUser("target");
    const time = options.getString("time");
    const member = guild.members.cache.get(user.id);
    const reason = options.getString("reason") || "Не указана";
    const convertedtime = ms(time);
    const errEmbed = new EmbedBuilder()
      .setDescription("Что-то не так, Попробуйте снова")
      .setColor(0xf16680);
    const succEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${user.tag} был замучен`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .addFields({ name: `Причина: `, value: `${reason}`, inline: true })
      .addFields({ name: `Время: `, value: `${time}`, inline: true })
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
    if (!convertedtime)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    try {
      await member.timeout(convertedtime, reason);
      interaction.reply({ embeds: [succEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
