
const { EmbedBuilder,SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const userModel = require("../../Models/user")
const gameModel = require("../../Models/game")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Играть в игры для получения коинов.")
    .addSubcommand(s =>
        s.setName("rorg")
        .setDescription("Поставить на красное или зеленое")
        .addNumberOption(n =>
            n.setName("ставка")
            .setDescription("Ваша ставка на игру")
            .setRequired(true)
            .setMinValue(100).setMaxValue(100000000)
            )
        )
    .addSubcommand(s=>
        s.setName("rps")
        .setDescription("Камень, Ножницы, Бумага")
        .addNumberOption(o=>
            o.setName("ставка")
            .setDescription("Укажите вашу ставку которую вы ставите на игру.")
            .setRequired(true)
            .setMinValue(100).setMaxValue(100000000)
            )
        .addStringOption(o=>
            o.setName("действие")
            .setDescription("Укажите действие которое вы покажете")
            .setRequired(true)
            .addChoices(
                { name: "Камень", value: "камень"},
                { name: "Ножницы", value: "ножницы"},
                { name: "Бумага", value: "бумага"},
            )
            ) 
    )    ,
    async execute(interaction, client){
      const { options , guildId, guild, member, user, channel} = interaction;
      const sub = options.getSubcommand(["rorg","rps"])
      const bet = options.getNumber("ставка")
      const modelUser = await userModel.findOne({ uid: member.id, gid: guildId})
      const modelGame = await gameModel.findOne({ uid: member.id, gid: guildId})

      let m = await interaction.deferReply({fetchReply: true})
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("game-green").setLabel("Зеленое").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("game-red").setLabel("Красное").setStyle(ButtonStyle.Danger),
      )
        try {
            switch(sub){
                case "rorg":
                if ( !modelUser || !modelGame ) return interaction.editReply("**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**");
                if( modelUser.eco.balance < bet) return interaction.editReply(`**😪 | У вас недостаточно коинов для ставки.**`)
                modelUser.game.bet = bet;
                const embed = new EmbedBuilder().setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL({dynamic:true})})
                .setTimestamp()
                .setDescription(`**\`«Красное, Зеленое»\`, вы вступили в игру с ботом**`)
                .addFields(
                    {name: `Статус:`, value: `\`В ожидании 🟡\``,inline:true},
                    {name: `Ставка:`, value: `\`${bet}\`💸`,inline:true},
                )
                .setFooter({text: `Support: https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
                modelGame.messageID = m.id;
                await modelUser.save();
                await modelGame.save();
                interaction.editReply({embeds:[embed], components:[buttons]})
                
                break;
                case "rps":
                    if(!modelUser) return interaction.editReply("**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**")
                    const emb = new EmbedBuilder().setTimestamp().setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `Support: https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
                    const choice = options.getString("действие")
                    if(modelUser.eco.balance < bet) return interaction.editReply("**😪 | У вас __не хватает__ коинов что бы сделать такую ставку!**")
                    modelUser.game.bet = bet;
                    const rr = Math.floor(Math.random() * 3)
                    let bot_choice = "";
                    if(rr == 0) bot_choice = "камень"
                    if(rr == 1) bot_choice = "бумага"
                    if(rr == 2) bot_choice = "ножницы"
                    if(choice == "камень" && bot_choice == "камень") {
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы выиграли:", value: `0 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nВы показали одинаковые предметы, победила дружба! Никто не получил коинов!**`)
                    }                    
                    if(choice == "камень" && bot_choice == "бумага") {
                        modelUser.eco.balance -= modelUser.game.bet
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы проиграли:", value: `${bet} 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nК сожалению вы проиграли, и вам прийдётся отдать коины боту, теперь он купит себе искусственный интелект.**`)
                    }
                    if(choice == "камень" && bot_choice == "ножницы") {
                        modelUser.eco.balance += modelUser.game.bet
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы выиграли:", value: `${bet} 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nВы успешно Выиграли бота. Так держать! Ваша ставка увеличена в 2 раза, коины перечислены на ваш счёт.**`)
                    }
                    if(choice == "ножницы" && bot_choice == "ножницы") {
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы выиграли:", value: `0 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nВы показали одинаковые предметы, победила дружба! Никто не получил коинов!**`)
                    }                    
                    if(choice == "ножницы" && bot_choice == "камень") {
                        modelUser.eco.balance -= modelUser.game.bet
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы проиграли:", value: `${bet} 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nК сожалению вы проиграли, и вам прийдётся отдать коины боту, теперь он купит себе искусственный интелект.**`)
                    }
                    if(choice == "ножницы" && bot_choice == "бумага") {
                        modelUser.eco.balance += modelUser.game.bet
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы выиграли:", value: `${bet} 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nВы успешно Выиграли бота. Так держать! Ваша ставка увеличена в 2 раза, коины перечислены на ваш счёт.**`)
                    }
                    if(choice == "бумага" && bot_choice == "бумага") {
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы выиграли:", value: `0 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nВы показали одинаковые предметы, победила дружба! Никто не получил коинов!**`)
                    }                    
                    if(choice == "бумага" && bot_choice == "ножницы") {
                        modelUser.eco.balance -= modelUser.game.bet
                        modelUser.game.bet = 0;
                        emb.addFields(
                            {name: "Вы проиграли:", value: `${bet} 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance} 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nК сожалению вы проиграли, и вам прийдётся отдать коины боту, теперь он купит себе искусственный интелект.**`)
                    }
                    if(choice == "бумага" && bot_choice == "камень") { 
                        modelUser.eco.balance += modelUser.game.bet
                        modelUser.game.bet = 0;
                        emb
                        .addFields(
                            {name: "Вы выиграли:", value: `${bet} 💸`, inline:true},
                            {name:"Текущий баланс:",value: `${modelUser.eco.balance } 💸`, inline:true}
                        ).setDescription(`**\`«Камень Ножницы Бумага»\`, вы успешно сыграли в эту игру с ботом.**\n\n**・Вы показали: \`${choice}\`\n・${client.user} показал: \`${bot_choice}\`\n\nВы успешно Выиграли бота. Так держать! Ваша ставка увеличена в 2 раза, коины перечислены на ваш счёт.**`)
                    }                    
                    emb.setColor("Blurple").setTimestamp()  
                    modelUser.eco.rpsTimes += 1;
                    await modelUser.save()
                    interaction.editReply({embeds:[emb]})  
                break;
            }
        } catch(e) {
            console.log(e);
            interaction.editReply({content:"Oshibka, check console",ephemeral:true})
        }
    },
};
