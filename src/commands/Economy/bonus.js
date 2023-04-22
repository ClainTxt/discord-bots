const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userModule = require("../../Models/user");
const css = require("../../Models/commands");
const moneysettings = require("../../Models/moneysettings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bonus")
    .setDescription("Получить 2-х часовой бонус."),
  async execute(interaction) {
    const { member, guild , guildId} = interaction;
    const embed = new EmbedBuilder()
    .setTimestamp()
    .setAuthor({
      name: interaction.member.displayName,
      iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
    });
    const dm = await moneysettings.findOne({ gid: guild.id})
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
    let reward = getRandomArbitrary(dm.bonus_min, dm.bonus_max) ;
    const cs = await css.findOne({ gid: guild.id })
    if( cs.bonus_status == "Выключена 🔴" ) return interaction.reply("**😪 | Команда \`(/bonus)\` выключена администрацией Discord сервера.**")
    if(!dm) return interaction.reply("**\`/fixserver\` Срочно сообщение __администрации Discord__ сервера**")
    let user = await userModule.findOne({ uid: member.id , gid: guildId});
    if(!user) return interaction.reply({ content: "**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**"})
    if(user.premium == true) reward * 1.5;
      if (Date.now() < user.eco.timelyTime) {
        const now = new Date(user.eco.timelyTime)
        return interaction.reply(`😪** | Не так быстро! Можешь использовать команду \`${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}\`**`);
      }
      user.eco.balance += parseInt(reward);
      user.eco.timelyTime = Date.now() + 7200000;
      user.eco.bonusTimes +=1;
      user.save();
      embed.setColor("Blurple").setFooter({ text: `Support https://discord.gg/GURtbqsBAW`, iconURL:guild.iconURL({dynamic:true})})
      .setTimestamp()
      .setDescription(`**・Вы успешно получили свой 2-х часовой бонус! Приходи через 2 часа, банк \`${guild.name} Company\` снова приготовит сюрприз.**`)
      .addFields({name: 'Вы получили:', value: `${parseInt(reward)}💸`, inline:true }, {name: "Текущий баланс:", value: `${user.eco.balance}💸`, inline:true})
      if(user.premium == true) {
        embed.setDescription(`**・Вы успешно получили свой 2-х часовой бонус! Приходи через 2 часа, банк \`${guild.name}\` снова приготовит сюрприз.\n\nТак как вы \`Премиум-пользователь\` коины были увеличены в 1.5 раза!**`)
      }
      interaction.reply({
        embeds:[embed]
      });
  },
};
