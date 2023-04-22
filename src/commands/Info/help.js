const {
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Получить список всех команд в боте."),
  async execute(interaction, client) {
    try {
      const embed = new EmbedBuilder().setTimestamp()
      .setTitle("🎨・Команды бота").setColor("Blurple")
      .setDescription(`**💸 Экономические команды:\n\`/register\`: Регистрация в экономике.\n\`/profile\`: Просмотр своего/чужого экономического профиля.\n\`/work\`: Начать заработок коинов.\n\`/bonus\`: Получить 2-х часовой бонус.\n\`/game\`: Играть в игры для получения коинов.\n\`/leaderboard\`: Посмотреть ТОП по коинам.\n\`/pay\`: Перевести коины другому пользователю.\n\`/rob\`: Ограбить другого пользователя.\n\`/shop\`: Преобрести роль в магазине Discord сервера.\n\nℹ Информационные команды:\n\`/server\`: Получение информации про Discord сервер.\n\n✨ Административные команды:\n\`/setprofile\`: Изменение профиля пользователя.\n\`/settings\`: Изменение настроек экономики нa сервере.\n\`/setshop\`: Изменение серверного магазина ролей.**`)
      .setFooter({text: "Команды бота", iconURL: client.user.displayAvatarURL({dynamic:true})})
      return interaction.reply({embeds:[embed]})
  } catch(error){
    console.log(error);
    interaction.reply("Some error")
  }
  },
};
