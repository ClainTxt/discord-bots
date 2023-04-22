const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Отправить сообщения от лица бота")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option.setName("text").setDescription("Что сказать?").setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Канал отправления")
    ),
    async execute(interaction){
        const { channel, options} = interaction;
        const channelSend = options.getChannel("channel") || channel;
        const text = options.getString("text")
        const embed = new EmbedBuilder()
        .setDescription("Сообщение успешно отправлено!")
        .setColor(0x00FF5E)
        await channelSend.send(text)
        await interaction.reply({embeds:[embed], ephemeral:true})
    }
};
