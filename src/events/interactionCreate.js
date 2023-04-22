const {
  Interaction,
  PermissionFlagsBits,
  messageLink,
  EmbedBuilder,
  ComponentType,
} = require("discord.js");
const gameModel = require("../Models/game");
const moneysettings = require("../Models/moneysettings");
const userModel = require("../Models/user");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { values, guild, customId, member, guildId, message, channel, user } = interaction;
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.editReply({
          content: "Ошибка в обработке команды!",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
            if(customId == "verify"){
              const role = guild.roles.cache.find((n) => n.name === "Verified");
              if (member.roles.cache.has(role.id)) return;
              member.roles.add(role)
            }
            const modelUser = await userModel.findOne({ uid: member.id, gid: guildId})
            const modelGame = await gameModel.findOne({ uid: member.id, messageID: message.id})
            const randomN = Math.floor(Math.random() * 100) 
            const dm = await moneysettings.findOne({ gid: guild.id})
            if(!dm) return interaction.reply("**\`/fixserver\` Срочно сообщение __администрации Discord__ сервера**")
            function getRandomArbitrary(min, max) {
              return Math.random() * (max - min) + min;
            }
            let reward = getRandomArbitrary(dm.work_min, dm.work_max);
            const embed = message.embeds[0];
            const embed1 = new EmbedBuilder();
            const sem = EmbedBuilder.from(embed)
            let bet
            if(modelUser) bet = modelUser.game.bet;
            if (!embed) return interaction.reply({content: "Ембеды не найдены",ephemeral: true,});
            switch (customId) {
              case "no-work":
                message.delete();
                break;
              case "yes-work":
                if(modelUser.premium == true) reward = reward*1.5;
                  const say = [
                    "психологом","доктором","пожарным","программистом","дальнобойщиком","развозчиком пиццы",
                    "садовником","таксистом","механиком","строителем","аудитором","аналитиком","банкиром","брокером","дилером","бухгалтером","операционистом",
                    "сметчиком","релайтером","товароведом"
                  ];
                  modelUser.eco.balance += parseInt(reward);
                  embed1.setTimestamp()
                  .setAuthor({
                    name: interaction.member.displayName,
                    iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
                  }).setColor("Blurple").setFooter({ text: guild.name, iconURL:guild.iconURL({dynamic:true})})
                  .addFields(
                    {name: "Вы получили:", value: `${parseInt(reward)}💸`, inline:true}, 
                    {name: "Текущий баланс:", value:  `${modelUser.eco.balance}💸`, inline:true}
                  ).setDescription(`**・Вы очень долго проработали \`${say[Math.floor(Math.random() * say.length)]}\`, информацию о заработке отправили в центр занятости, коины должны поступить на ваш счёт.**`) 
                  if(modelUser.premium == true) {
                    embed1.setDescription(`**・Вы очень долго проработали \`${say[Math.floor(Math.random() * say.length)]}\`, информацию о заработке отправили в центр занятости, коины должны поступить на ваш счёт.\n\nТак как вы \`Премиум-пользователь\` коины были умножены в 1.5 раза!**`)
                  }
                  modelUser.eco.workTimes += 1;
                  await modelUser.save();
                  message.edit({embeds:[embed1], components: []})
                break;
              case "game-red":
                  if(!modelGame || !modelUser) return;
                  if(randomN > 50){
                  modelUser.eco.balance += parseInt(bet);
                  sem.setColor("Green")
                  sem.setDescription(`**\`«Красное, Зеленое»\`, вы успешно сыграли в игру с ботом\n\nРезультаты:\n・Вы выбрали: \`🔴\`\n・Выпало: \`🔴\`**`)
                  sem.setFields(
                      {name: `Статус:`, value: `\`Выигрыш 🟢\``,inline:true},
                      {name: `Ставка:`, value: `\`${bet}\`💸`,inline:true},
                      {name: `Текущий баланс:`, value: `\`${modelUser.eco.balance}\`💸`,inline:true},
                  )
                  }
                  if(randomN <= 50){
                    modelUser.eco.balance -= parseInt(bet);
                    sem.setColor("Red")
                    sem.setDescription(`**\`«Красное, Зеленое»\`, вы успешно сыграли в игру с ботом\n\nРезультаты:\n・Вы выбрали: \`🔴\`\n・Выпало: \`🟢\`**`)
                    sem.setFields(
                        {name: `Статус:`, value: `\`Проигрыш 🔴\``,inline:true},
                        {name: `Вы проиграли:`, value: `\`${bet}\`💸`,inline:true},
                        {name: `Текущий баланс:`, value: `\`${modelUser.eco.balance}\`💸`,inline:true},
                    )
                  }
                  modelUser.game.bet = 0;
                  modelGame.messageID = "";
                  await modelUser.save()
                  await modelGame.save()
                  message.edit({embeds:[sem], components:[]})
                  break;
              case "game-green":
              if(!modelGame || !modelUser) return;
              if(randomN > 50){
              modelUser.eco.balance += parseInt(bet);
              sem.setColor("Green")
              sem.setDescription(`**\`«Красное, Зеленое»\`, вы успешно сыграли в игру с ботом\n\nРезультаты:\n・Вы выбрали: \`🟢\`\n・Выпало: \`🟢\`**`)
              sem.setFields(
                  {name: `Статус:`, value: `\`Выигрыш 🟢\``,inline:true},
                  {name: `Ставка:`, value: `\`${bet}\`💸`,inline:true},
                  {name: `Текущий баланс:`, value: `\`${modelUser.eco.balance}\`💸`,inline:true},
              )
              }
              if(randomN <= 50){
                modelUser.eco.balance -= parseInt(bet);
                sem.setColor("Red")
                sem.setDescription(`**\`«Красное, Зеленое»\`, вы успешно сыграли в игру с ботом\n\nРезультаты:\n・Вы выбрали: \`🟢\`\n・Выпало: \`🔴\`**`)
                sem.setFields(
                    {name: `Статус:`, value: `\`Проигрыш 🔴\``,inline:true},
                    {name: `Вы проиграли:`, value: `\`${bet}\`💸`,inline:true},
                    {name: `Текущий баланс:`, value: `\`${modelUser.eco.balance}\`💸`,inline:true},
                )
              }
              modelUser.game.bet = 0;
              modelGame.messageID = "";
              await modelUser.save()
              await modelGame.save()
              message.edit({embeds:[sem], components:[]})
              break;
              case "suggest-accept":
                if (!member.permissions.has(PermissionFlagsBits.Administrator)) return client.users.send(user.id, "У тебя нету прав администратора.");
                embed.data.fields[2] = {
                  name: "Статус",
                  value: "Одобрен",
                  inline: true,
                };
                const acceptEmbed = EmbedBuilder.from(embed).setColor(0x20ff14);
                message.edit({ embeds: [acceptEmbed] });
                interaction.reply({
                  content: "Предложение успешно обновлено.",
                  ephemeral: true,
                });
                break;
              case "suggest-decline":
                if (!member.permissions.has(PermissionFlagsBits.Administrator)) return client.users.send(user.id, "У тебя нету прав администратора.");
                embed.data.fields[2] = {
                  name: "Статус",
                  value: "Отказан",
                  inline: true,
                };
                const declineEmbed =
                  EmbedBuilder.from(embed).setColor(0xff1a00);
                message.edit({ embeds: [declineEmbed] });
                interaction.reply({
                  content: "Предложение успешно обновлено.",
                  ephemeral: true,
                });
                break;
              default:
                interaction.reply({
                  content: "Это че за кнопка, я ее не знаю",
                  ephemeral: true,
                });
                break;
            }
    } else if (interaction.isSelectMenu()) {
      switch (customId) {
        case "reaction-role":
          for (let i = 0; i < values.length; i++) {
            const roleId = values[i];
            const role = guild.roles.cache.get(roleId);
            const hasRole = member.roles.cache.has(roleId);
            switch (hasRole) {
              case true:
                member.roles.remove(roleId);
                break;
              case false:
                member.roles.add(roleId);
                break;
            }
            interaction.reply({ content: "Роли обновлены", ephemeral: true });
            break;
          }
      }
    } else {
      return;
    }
  },
};
