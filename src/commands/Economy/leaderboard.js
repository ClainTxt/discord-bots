const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const userModel = require("../../Models/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Посмотреть лидеров по балансу."),

  async execute(interaction, client) {
    const{ user, member, guildId ,guild} = interaction;
    let db = await userModel.find({ gid: guildId})
    if(!db.length >= 1) return interaction.reply(`**😪 | На сервере недостаточно зарегестрированных пользователей.**`)
    const f = (await db).splice(0,10).sort((a, b) => parseFloat(b.eco.balance) - parseFloat(a.eco.balance)).filter(a => a.eco.balance > 0).map((n, i) => `**${n.tag} (\`${n.uid}\`) ~ ${n.eco.balance} 💸**`).join("\n")
    const embed = new EmbedBuilder().setTitle("Топ-10 лидеров по балансу").setColor("Blurple")
    .setAuthor({name: `${guild.name}`, iconURL: guild.iconURL({dynamic:true})})
    .setDescription(`${f}`)
    .setFooter({text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
    .setTimestamp()
    return interaction.reply({embeds:[embed]})
  },
};
