const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const userModule = require("../../Models/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Просмотр своего/чужого экономического профиля.")
    .addUserOption((option) =>
      option.setName("user").setDescription("Указать пользователя")
    ),
  async execute(interaction,client) {
    const { guild, guildId, member} = interaction;
    let mention1 = interaction.options.getUser("user") || interaction.user;
    let user = await userModule.findOne({ uid: mention1.id , gid: guildId});
    if(!user) return interaction.reply("**😪 | Вы или тот кого вы указали - не зарегестрированны в системе. Пропишите команду \`/register.\`**")
    const regTime = new Date(user.register_time);
    let premka = "";
    if(user.premium) premka = "Премиум-пользователь"
    if(!user.premium) premka = "Отсутствует"
    const regTimeFull = `${regTime.getDate()}.${regTime.getMonth()+1}.${regTime.getFullYear()}`
    const embed = new EmbedBuilder().setColor("Blurple")
    .setAuthor({name: `${mention1.tag}` , iconURL: user.avatarURL})
    .setDescription(`**📅 | Дата регистрации: **\`${regTimeFull}\`\n**💰 | Баланс: **\`${user.eco.balance}\`💸\n**👑 | Премиум статус: **\`${premka}\``)
    .setFooter({text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})}).setTimestamp()
    interaction.reply({embeds:[embed]})
  },
};
