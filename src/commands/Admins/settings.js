const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const command = require("../../Models/commands");
const moneysettings = require("../../Models/moneysettings");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Настройки")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(s=>s.setName("bonus").setDescription("Настроить систему бонуса (/bonus)")
        .addNumberOption(o=>o
            .setName("min-bonus")
            .setDescription("Укажите минимальную выдачу коинов (от 1 до 1.000)")
            .setMinValue(1).setMaxValue(1000).setRequired(true))
        .addNumberOption(o=>o
            .setName("max-bonus")
            .setDescription("Укажите максимальную выдачу коинов (от 1 до 100.000)")
            .setMinValue(1).setMaxValue(100000).setRequired(true))    
            )
    .addSubcommand(s=>s.setName("work").setDescription("Настроить систему работ (/work)")
        .addNumberOption(o=>o
            .setName("min-work")
            .setDescription("Укажите минимальную выдачу коинов (от 1 до 10.000)")
            .setMinValue(1).setMaxValue(10000).setRequired(true))
        .addNumberOption(o=>o
            .setName("max-work")
            .setDescription("Укажите максимальную выдачу коинов (от 1 до 100.000)")
            .setMinValue(1).setMaxValue(100000).setRequired(true))    
        )            
    .addSubcommand(s=>s.setName("check").setDescription("Посмотреть уже действующие настройки Discord сервера."))
    .addSubcommand(s=>s.setName("command-status").setDescription("Изменить статус команды(включить/выключить).")
        .addStringOption(s=>s.setName("command")
        .setDescription("Укажите команду которую хотите изменить.")
        .setRequired(true)
        .addChoices(
            { name: "Работа (/work)", value: "work"},
            { name: "Бонус (/bonus)", value: "bonus"},
            { name: "Регистрация (/register)", value: "register"},
            { name: "Ограбление (/rob)", value: "rob"},
            { name: "Магазин (/shop)", value: "shop"},
        ))
        .addStringOption(s=>s.setName("status")
        .setDescription("Укажите статус команды (включить/выключить)")
        .setRequired(true)
        .addChoices(
            { name: "Включить", value: "Включена 🟢"},
            { name: "Выключить", value: "Выключена 🔴"},
        ))
    )
    ,
    async execute(interaction, client){        
        const { options, member, guild} = interaction;
        const cname = options.getString("command")
        const status = options.getString("status")
        const ms = await moneysettings.findOne({gid: guild.id})
        if(!ms) await moneysettings.create({
            gid: guild.id
        })
        const cmds = await command.findOne({ gid: guild.id })
        if(!cmds) await command.create({
            gid: guild.id
        })
        const sub = options.getSubcommand(["command-status", "check", "work", "bonus"])
        const maxw = options.getNumber("max-work")
        const minw = options.getNumber("min-work")
        const maxb = options.getNumber("max-bonus")
        const minb = options.getNumber("min-bonus")
        const embed = new EmbedBuilder().setTimestamp()
        .setAuthor({ name: `Настройки Discord сервера.`})
        .setFooter({ text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
        switch(sub) {
            case "work":
                await interaction.deferReply({fetchReply:true})
                ms.work_max = maxw;
                ms.work_min = minw;
                ms.save()
                embed.setDescription(`**\
                🔨 | Установлены новые настройки на команду (\`/work\`):\n\
                ・Минимальная сумма выдачи coins: \`${ms.work_min}\` 💸\n\
                ・Максимальная сумма выдачи coins: \`${ms.work_max}\` 💸**`)
                interaction.editReply({embeds:[embed]})
            break;
            case "bonus":
                await interaction.deferReply({fetchReply:true})
                ms.bonus_max = maxb;
                ms.bonus_min = minb;
                ms.save()
                embed.setDescription(`**\
                🔨 | Установлены новые настройки на команду (\`/bonus\`):\n\
                ・Минимальная сумма выдачи coins: \`${ms.bonus_min}\` 💸\n\
                ・Максимальная сумма выдачи coins: \`${ms.bonus_max}\` 💸**`)
                interaction.editReply({embeds:[embed]})
            break;
            case "command-status":
                await interaction.deferReply({fetchReply:true})
                if(cname == "work"){
                    cmds.work_status = status;
                }
                if(cname == "rob"){
                    cmds.rob_status = status;
                }
                if(cname == "register"){
                    cmds.register_status = status;
                }
                if(cname == "shop"){
                    cmds.shop_status = status;
                }
                if(cname == "bonus"){
                    cmds.bonus_status = status;
                }        
                embed.setDescription(`**・Статус команды /work (\`${cmds.work_status}\`)\n\
                ・Статус команды /bonus (\`${cmds.bonus_status}\`)\n\
                ・Статус команды /register (\`${cmds.register_status}\`)\n\
                ・Статус команды /rob (\`${cmds.rob_status}\`)\n\
                ・Статус команды /shop (\`${cmds.shop_status}\`)\n**`)
                interaction.editReply({embeds:[embed]})
                
                cmds.save();
            break;
            case "check":
                await interaction.deferReply({fetchReply:true})
                embed.setDescription(`**・Статус команды /work (\`${cmds.work_status}\`)\n\
                ・Статус команды /bonus (\`${cmds.bonus_status}\`)\n\
                ・Статус команды /register (\`${cmds.register_status}\`)\n\
                ・Статус команды /rob (\`${cmds.rob_status}\`)\n\
                ・Статус команды /shop (\`${cmds.shop_status}\`)\n**`)
                interaction.editReply({embeds:[embed]})
                break;
        }
    }
}