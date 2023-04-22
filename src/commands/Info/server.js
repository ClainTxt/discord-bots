const { EmbedBuilder, SlashCommandBuilder, CategoryChannel, ChannelType } = require("discord.js");
const userModule = require("../../Models/user")
module.exports = {
    data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Получить информация о Discord сервере."),
    async execute(interaction,client){
        const { guild, guildId, member} = interaction;
        let users = await userModule.find({ gid: guildId });
        const time = new Date(guild.createdTimestamp);
        const time2 = new Date(guild.joinedTimestamp);
        const t2 = `${time2.getDate()}.${time2.getMonth()+1}.${time2.getFullYear()} ${time2.getHours()}:${time2.getMinutes()}:${time2.getSeconds()}`
        const t3= `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        const embed = new EmbedBuilder().setColor("Blurple")
        .setTitle("👑・Информация о Discord сервере")
        .setDescription(`
        **🎨 | Название: \`${guild.name}\`.\n🎉 | Дата добавления бота на сервер: \`${t2}\`.\n📆 | Дата создания Discord сервера: \`${t3}\`.\n👥 | Количество зарегистрированных пользователей: \`${users.length}\`.\n\n🖐 | Количество пользователей: \`${guild.memberCount}\`.\n🎳 | Количество ролей на сервере: \`${guild.roles.cache.size-1}\`.\n\💬 | Количество каналов на сервере: \`${guild.channels.cache.filter(c=>c.type !== ChannelType.GuildCategory).size}\`.\n\❌ | Количество заблокированных пользователей: \`${guild.bans.cache.size}\`.\n\n👑 | Владелец сервера: <@${guild.ownerId}>.**`)
        .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic:true})}).setTimestamp()
        interaction.reply({embeds:[embed]})
    }
}