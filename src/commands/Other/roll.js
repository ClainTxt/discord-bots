const { EmbedBuilder, SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Кинуть кость ( от 1 до 6 )"),
  async execute(interaction) {
    const res = Math.floor(Math.random() * (6 - 1) + 1);
    const {member, user} = interaction;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`🎲 Тебе выпало ${res}`)
      .setTimestamp()
      .setColor(0xD6C7E7);
    interaction.reply({embeds:[embed]}).catch(err => {return console.log(`${err} oshibka`)})
  },
};
