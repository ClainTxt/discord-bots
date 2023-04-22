const { EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const user = require("../../Models/user");
const userModel = require("../../Models/user");
const css = require("../../Models/commands");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Ограбить другого пользователя.")
    .addUserOption(o=>
        o.setName("пользователь")
        .setDescription("Укажите пользователя которого вы собираетесь ограбить.")
        .setRequired(true)
        ),
    async execute(interaction,client){
        const { options, guildId, guild, member} = interaction;
        const cs = await css.findOne({ gid: guild.id })
        await interaction.deferReply({ fetchReply:true })
        if( cs.rob_status == "Выключена 🔴" ) return interaction.editReply("**😪 | Команда \`(/rob)\` выключена администрацией Discord сервера.**")
        const embed = new EmbedBuilder().setTimestamp()
        const mention = options.getUser("пользователь")
        const user1 = await userModel.findOne({ uid: member.id , gid: guildId})
        const user2 = await userModel.findOne({ uid: mention.id , gid: guildId})
        if(!user1) return interaction.editReply("Вы, не зарегистрированы || /register ||")
        if(!user2) return interaction.editReply("**😪 | Пользователь которого вы хотите ограбить не зарегестрирован в системе.**")
        const randomN = Math.floor(Math.random() * user2.eco.balance/2)
        const randomM = Math.floor(Math.random() * 500)
        const shance = Math.floor(Math.random() * 100);
        if(user1.eco.balance < 1000) return interaction.editReply("**😪 | Для того что бы начать грабить пользователей, на вашем счёте должно быть не меньше 1000 💸**")
        if(user2.eco.balance < 500) return interaction.editReply("**😪 | У пользователя и так коинов нету, ещё и ты грабить пытаешься... У пользователя меньше 500 💸**")
        if(shance < 50){
            embed.setColor("Blurple")
            .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic:true})})
            .setAuthor({name: member.displayName || mention.tag, iconURL: member.displayAvatarURL({dynamic:true} || mention.displayAvatarURL({dynamic:true}))})
            .setDescription(`**💰 | Вам не удалось ограбить пользователя ${mention}\n К вам пришла полиция и выписала штраф в размере: \`${randomM}\` 💸**`)
            user1.eco.balance -= parseInt(randomM)
            return interaction.editReply({embeds:[embed]})
        }
        else {
            embed.setColor("Blurple")
            .setFooter({text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})}).setTimestamp().setAuthor({name: member.displayName || mention.tag, iconURL: member.displayAvatarURL({dynamic:true} || mention.displayAvatarURL({dynamic:true}))})
            .setDescription(`**💰 | Вам удалось ограбить пользователя ${mention} и вы получили \`${randomN}\`💸**`)
            user1.eco.balance += parseInt(randomN)
            user1.eco.robTimes += 1;
            user2.eco.balance -= parseInt(randomN)
        }
        await user1.save()
        await user2.save()
        return interaction.editReply({embeds:[embed]})
    }
}