const { EmbedBuilder, SlashCommandBuilder } = require("@discordjs/builders");
const userModel = require("../../Models/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("no")
    .setDescription("Отменить предложение"),
  async execute(interaction) {
    const { member,user, channel, guild, options, guildId } = interaction;
    if (!channel.id === guild.channels.cache.find(n=>n.name === 'игры')) return interaction.reply({content: "Используйте канал #игры, тут нельзя", ephemera:true})
    try{
      // Обьявление ДБ
      const user1 = await userModel.findOne({ uid: user.id , gid: guildId});
      const user2 = await userModel.findOne({ uid: user1.game.id , gid: guildId});  
      if(!user1 ) return interaction.reply('**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**')
      // Система принятия
      if( user1.game.status == true){
          // обнуление статистик
          user1.game.bet = 0;
          user2.game.bet = 0;
          user1.game.result = 0;
          user2.game.result = 0;
          user1.game.id = 0;
          user2.game.id = 0
          user2.game.bet = 0;
          user1.game.status = false;
          user2.game.status = false;
          user1.game.who = "";
          user2.game.who = "";
          interaction.reply({content: "Вы успешно отменили все предложения"})
          await user1.save();
          await user2.save();
      } else {
        return interaction.reply({content: "У вас нету активных предложений", ephemeral:true})
      }
    } catch(e){
      console.log(e);
      interaction.reply({ content: `Ошибка`, ephemeral: true });
    }
  },
};
