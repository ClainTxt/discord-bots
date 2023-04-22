const { EmbedBuilder, SlashCommandBuilder } = require("@discordjs/builders");
const userModel = require("../../Models/user");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Кинуть кость с игроком")
    .addUserOption((option) =>
      option.setName("user").setDescription("С кем играть").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("bet").setDescription("Ставка").setRequired(true)
    ),
  async execute(interaction) {
    // константы
    const { member,user, channel, guild, options, guildId } = interaction;
    if (!channel === guild.channels.cache.find(n=>n.name === 'игры')) return interaction.reply({content: "Используйте канал #игры, тут нельзя", ephemera:true})
    const target = options.getUser("user");
    const bet = options.getNumber("bet");
    if ( target === user) return interaction.reply({content: "Нельзя играть с самим собой",ephemera:true})
    try {
      const user1 = await userModel.findOne({ uid: user.id , gid: guildId});
      const user2 = await userModel.findOne({ uid: target.id, gid: guildId });
      if(!user1 || !user2) return interaction.reply('**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**')
      if ( user1.game.status === true || user2.game.status === true) return interaction.reply('У кого-то из вас уже есть активное предложение')
      if(user1.eco.balance < bet || user2.eco.balance < bet) return interaction.reply("У кого-то из вас нету столько денег!")
      const diceSendEmbed = new EmbedBuilder()
      .setAuthor({name: `${member.displayName}`, iconURL: member.displayAvatarURL({dynamic:true})})
      .setDescription(`Предлагает сыграть в кости\nСтавка: \`${bet}💸\`\n**Принять - \`/yes\`, Отклонить - \`/no\`**`)
      .setTimestamp()
      .setFooter({text: "Support https://discord.gg/GURtbqsBAW", iconURL: client.user.displayAvatarURL({dynamic:true})})
      // кидание предложения
      interaction.reply({content:'Предложение сыграть отправлено',ephemeral:true})
      channel.send({content:`<@${target.id}>`,embeds:[diceSendEmbed]})
      // db set
      user1.game.status = true;
      user1.game.id = target.id;
      user2.game.id = user.id;
      user2.game.status = true;
      user1.game.bet = parseInt(bet);
      user2.game.bet = parseInt(bet);
      user1.game.who = "Кидающий";
      user2.game.who = "Принимающий";
      await user1.save();
      await user2.save();
    } catch (e) {
      console.log(e);
      interaction.reply({ content: `Ошибка`, ephemeral: true });
    }
  },
};

/* 20 12 20222. ИТОГИ: работает криво, кидается, тот кому кинули если примет игра произойдет даст деньги результат обнуляет ставку ну это логично,
проблема: любой может отменить не тот кто кинул, криво записывается айди

*/
