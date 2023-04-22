const { EmbedBuilder, SlashCommandBuilder } = require("@discordjs/builders");
const userModel = require("../../Models/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yes")
    .setDescription("Принять предложение"),
  async execute(interaction, client) {
    const { member,user, channel, guild, options, guildId } = interaction;
    if (!channel.id === guild.channels.cache.find(n=>n.name === 'игры')) return interaction.reply({content: "Используйте канал #игры, тут нельзя", ephemera:true})
    try{
      // Обьявление ДБ
      const user1 = await userModel.findOne({ uid: user.id , gid: guildId});
      const user2 = await userModel.findOne({ uid: user1.game.id , gid: guildId});
      if(!user1 ) return interaction.reply('Вы не зарегистрированы, используйте /register')
      const res = Math.floor(Math.random() * (6 - 1) + 1);
      const res2 = Math.floor(Math.random() * (6 - 1) + 1);      
      // Система принятия
      if( user1.game.status == true){
        if (user1.game.who === "Принимающий"){
          const resultEmbed = new EmbedBuilder()
          .setTitle("Результат")
          .addFields({name: `${user1.tag}`, value: `Выпало: ${res}`}, {name: `${user2.tag}`, value: `Выпало: ${res2}`})
        user1.game.result = res;
        user2.game.result = res2;
        if ( user1.game.result > user2.game.result ){
          resultEmbed.setDescription(`Поздравляю вы выиграли: \`${user1.game.bet * 2}💸\`\nПобедитель: ${user1.tag}`)
          // выдача баланса
          user1.eco.balance += user1.game.bet;
          user2.eco.balance -= user2.game.bet;
          // обнуление статистик
          user1.game.bet = 0;
          user2.game.bet = 0;
          user1.game.result = 0;
          user2.game.result = 0;
          user2.game.id = 0;
          user1.game.id = 0;
          user2.game.bet = 0;
          user1.game.status = false;
          user2.game.status = false;
          user1.game.who = "";
          user2.game.who = "";
          // 
          client.users.send(user1.game.id,"Вы проиграли")
          interaction.reply({embeds:[resultEmbed]})
          await user1.save();
          await user2.save();
        } else {
          resultEmbed.setDescription(`К сожалению вы проиграли \`${user2.game.bet}💸\`\nПобедитель: ${user2.tag}`)
          // выдача баланса
          user1.eco.balance -= user1.game.bet;
          user2.eco.balance += user2.game.bet;
          // обнуление статистик
          user1.game.bet = 0;
          user2.game.bet = 0;
          user1.game.result = 0;
          user2.game.result = 0;
          user1.game.id = 0;
          user2.game.bet = 0;
          user1.game.status = false;
          user2.game.status = false;
          user1.game.who = "";
          user2.game.who = "";
          // 
          interaction.reply({embeds:[resultEmbed]})
          await user1.save();
          await user2.save();          
        }
        } else {
          return interaction.reply("Вы не принимающий, отменить можно комадной [ /no ]")
        }
      } else {
        return interaction.reply({content: "У вас нету активных предложений", ephemeral:true})
      }
    } catch(e){
      console.log(e);
      interaction.reply({ content: `Ошибка`, ephemeral: true });
    }
  },
};
