const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const userModule = require("../../Models/user")
module.exports = {
    data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Показать статистику использований команд.")
    .addUserOption(o=>o.setName("пользователь").setDescription("Укажите пользователя у которого хотите посмотреть статистику.")),
    async execute(interaction,client){
        const { guild, guildId, member} = interaction;
        let mention = interaction.options.getUser("пользователь") || interaction.user;
        let user = await userModule.findOne({ uid: mention.id , gid: guildId});
        if(!user) return interaction.reply("**😪 | Вы или тот кого вы указали - не зарегестрированны в системе. Пропишите команду \`/register.\`**")
        const regTime = new Date(user.register_time);
        const embed = new EmbedBuilder().setColor("Blurple")
        .setAuthor({name: `${member.displayName || mention.tag}` , iconURL: user.avatarURL})
        .setDescription(`**🎈 | Информация по использованию команд:\n» Количество рабочих дней: \`${user.eco.workTimes}\`.\n» Количество полученных бонусов: \`${user.eco.bonusTimes}\`.\n» Количество ограблений: \`${user.eco.robTimes}\`.\n» Количество сыгранных игр в КНБ: \`${user.eco.rpsTimes}\`.**`)
        .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic:true})}).setTimestamp()
        interaction.reply({embeds:[embed]})
    }
}