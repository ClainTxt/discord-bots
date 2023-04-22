const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonStyle,
  CommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createverify")
    .setDescription("Изменить канал для верификации")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Отправить сообщение для верификации в этот канал")
    ),
  async execute(interaction) {
    const { options } = interaction;
    const channel = options.getChannel("channel");
    const verifyEmbed = new EmbedBuilder()
      .setTitle("Верификация")
      .setDescription(
        "Кликните на кнопку чтобы верифицировать ваш аккаунт и получить доступ к каналам."
      )
      .setColor(0x5fb041);
    let sendChannel = channel.send({
      embeds: ([verifyEmbed]),
      components: [new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId("verify").setLabel('Verify').setStyle(ButtonStyle.Success))],
    });
    if (!sendChannel){
            interaction.reply({content:'КАКАЯТА АШИБКА ВЫЛИЗЛА ПАПРОБУЙ ПОЖЕ',ephemeral:true})
    } else{
        interaction.reply({content:'Ошибок нету, все прошло успешно!',ephemeral:true})

    }
  },
};
