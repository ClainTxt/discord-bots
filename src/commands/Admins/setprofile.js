const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const userModule = require("../../Models/user")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setprofile")
    .setDescription("Отредактировать профиль пользователя")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(s=>
        s.setName("set-coins")
        .setDescription("Изменить счет коинов пользователю")
        .addNumberOption((option) =>
          option
            .setName("коины")
            .setDescription("Укажите количество коинов.")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("пользователь")
            .setDescription("Укажите пользователя (необязательно).")
        )
    )
    .addSubcommand(s=>s.setName("reset-time").setDescription("Обнулить время для получения наград").addUserOption((option) =>option.setName("пользователь").setDescription("Укажите пользователя (необязательно)."))
    )
    .addSubcommand(s=> s.setName("set-premium").setDescription("Установить статус пользователю")
        .addBooleanOption(o=> o.setName("статус").setDescription("Выберите статус").setRequired(true))
        .addUserOption((option) => option.setName("пользователь").setDescription("Укажите пользователя (необязательно)."))
    ),
    async execute(interaction,client){
        const { options, member, user, guild, guildId} = interaction; 
        const mention = options.getUser("пользователь") || user;
        const status = options.getBoolean("статус")
        const coins = options.getNumber("коины")
        const embed = new EmbedBuilder()
        .setTimestamp()
        .setColor("Blurple")
        .setAuthor({name: mention.tag, iconURL: mention.displayAvatarURL({ dynamic: true})})

        .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic:true})})

        
        const moduleUser = await userModule.findOne({ gid: guildId, uid: mention.id || member.id,})
        if(!moduleUser) return interaction.reply("**😪 | Кого вы указали не зарегестрированны в системе. Пропишите команду \`/register.\`**")
        const sub = options.getSubcommand(["set-coins","reset-time","set-premium"]);
        switch(sub){
            case "set-coins":
                embed
                .setDescription(`**Вы успешно изменили значение коинов у пользователя.**`)
                .addFields(
                    {name: "Старое значение:", value: `${moduleUser.eco.balance} 💸`, inline: true},
                    {name: "Новое значение:", value: `${coins} 💸`, inline: true},
                )
                moduleUser.eco.balance = parseInt(coins);
                await moduleUser.save();
                return await interaction.reply({embeds:[embed]})
            case "reset-time":
                embed
                .setDescription(`**Вы успешно обнулили время для получения наград пользователю.**`)
                moduleUser.eco.timelyTime = 0;
                moduleUser.eco.worktime = 0;
                await moduleUser.save();
                return await interaction.reply({embeds:[embed]})
            case "set-premium":
                if(moduleUser.premium == status) return interaction.reply("У пользователя уже установлен такой статус")
                moduleUser.premium = status;
                embed
                .setDescription(`**Вы успешно изменили премиум статус пользователю.**`)                
                .addFields(
                    {name: "Старое значение:", value: `\`Премиум-пользователь\``, inline: true},
                    {name: "Новое значение:", value: `\`Отсутствует\``, inline: true},
                )
                if(moduleUser.premium) embed.setFields(
                    {name: "Старое значение:", value: `\`Отсутствует\``, inline: true},
                    {name: "Новое значение:", value: `\`Премиум-пользователь\``, inline: true},
                )
                await moduleUser.save();
                return await interaction.reply({embeds:[embed]})
        }
    }
}