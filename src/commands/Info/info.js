
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const uSchema = require("../../Models/user");
const botinfo = require("../.././Models/botinfo")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Посмотреть информация о боте"),
  async execute(interaction, client) {
    const { channel, guild, member, guildId} = interaction;
    const users = await uSchema.find()
    const binfo = await botinfo.findOne()
    const lastUp = new Date(binfo.lastUpdate);
    const convtime_lastup = `${lastUp.getDate()}.${lastUp.getMonth()+1}.${lastUp.getFullYear()} ${lastUp.getHours()}:${lastUp.getMinutes()}:${lastUp.getSeconds()}`
    const time = new Date(client.readyTimestamp);
    const lasttime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    const embed = new EmbedBuilder()
    .setTitle("👑・Статистика состояния бота")
    .setDescription(`**🏆 | Версия бота: \`${binfo.lastVersion}\`.\n📆 | Последнее обновление: \`${convtime_lastup}\`.\n⏳ | Последнее время перезапуска: \`${lasttime}\`.\n\n👤 | Зарегестрированные пользователи: \`${users.length}\`.\n🏹 | Количество серверов: \`${client.guilds.cache.size}\`.**`)
    .setFooter({text: guild.name, iconURL: guild.iconURL({dynamic:true})})    

    return interaction.reply({embeds:[embed]})

  },
};
