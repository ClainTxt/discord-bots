const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");
const userModule = require("../../Models/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("try")
    .setDescription("Игра 50 на 50, повезет или нет.")
    .addIntegerOption((option) =>
      option.setName("bet").setDescription("Ваша ставка")
      .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, member, channel, options, guildId } = interaction;
    const bet = options.getInteger("bet");
    let user = await userModule.findOne({ uid: member.id, gid: guildId });
    if(!user) return interaction.reply({ content: "Вы не зарегестрированы\nИспользуйте /register", ephemeral:true})
    const status = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    const embed = new EmbedBuilder();
    if (user.eco.balance < bet) {
      embed
        .setDescription("У вас недостаточно денег для совершения ставки")
        .setColor(0xff0000);
      return interaction.reply({ embeds: [embed] , ephemeral:true});
    }
    if (status < 50) {
      user.eco.balance += parseInt(bet);
      embed.setColor(0x00FF00)
      .setDescription(`Вы выиграли \`${bet*2}💸\`\nВаш баланс: ${user.eco.balance}`).setAuthor({
        name: `${member.user.tag}`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      });
    } else {
      user.eco.balance -= parseInt(bet);
      embed.setColor(0xff0000)
      .setDescription(`Вы проиграли \`${bet}💸\`\nВаш баланс: ${user.eco.balance}`).setAuthor({
        name: `${member.user.tag}`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      });
    }
    interaction.reply({ /*content:`test @${user.doc.tag}`,*/ embeds: [embed] })
    await user.save();
  },
};
