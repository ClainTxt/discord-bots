
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const userModule = require("../../Models/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Перевести коины другому пользователю.")
    .addUserOption(o=> o.setName("пользователь")
    .setRequired(true)
    .setDescription("Кому передать")
    )
    .addIntegerOption((option) =>
      option.setName("коины").setDescription("Ваша ставка")
      .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, member, channel, options, user, guildId } = interaction;
    const amount = options.getInteger("коины");
    const target = options.getUser("пользователь");
    let user1 = await userModule.findOne({ uid: member.id , gid: guildId});
    let user2 = await userModule.findOne({ uid: target.id , gid: guildId});
    if(!user2) return interaction.reply({ content: "**😪 | Указанный пользователь не зарегестрирован в системе.**"})
    if(!user1) return interaction.reply({ content: "**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**"})
    if (target == user) return interaction.reply("Самому себе нельзя")
    const embed = new EmbedBuilder();
    if (user1.eco.balance < amount) {
      embed
        .setDescription("У вас недостаточно денег для совершения операции")
        .setColor("Red");
      return interaction.reply({ embeds: [embed] , ephemeral:true});
    }
    try {
    user1.eco.balance -= amount;
    user2.eco.balance += amount;
    embed.setColor('Blurple')
    .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL({dynamic:true})})
    .setDescription(`**Вы успешно перевели \`${amount}\`💸 пользователю: ${target} (\`${target.id}\`).**`)
    .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic:true})})
    await user1.save();
    await user2.save();
    interaction.reply({ embeds: [embed] })
  } catch(e){
    console.log(e);
  }
  }, 
};
