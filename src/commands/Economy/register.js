
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const uSchema = require("../../Models/user");
const gSchema = require("../../Models/game")
const { model, Schema } = require("mongoose");
const css = require("../../Models/commands");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Регистрация в экономике."),
  async execute(interaction, client) {
    const { channel,guild, member, guildId} = interaction;
    const cs = await css.findOne({ gid: guild.id })
    if( cs.register_status == "Выключена 🔴" ) return interaction.reply("**😪 | Команда \`(/register)\` выключена администрацией Discord сервера.**")
    .then(m=> interaction.reply("**❗ | Ошибка, используйте \`/fixserver\`**"))
    const user = await uSchema.findOne({ uid: interaction.user.id , gid: guildId});
    const game = await gSchema.findOne({ uid: interaction.user.id})
    const regTime = new Date();
    if (!user || !game ) {
      await uSchema.create({
        gid: guildId,
        uid: interaction.user.id,
        tag: interaction.user.tag,
        eco: { balance: 100 },
        register_time: regTime,
        avatarURL: member.displayAvatarURL({dynamic:true}),
      });
      await gSchema.create({
        gid: guildId,
        uid: interaction.user.id
      })
      const embed = new EmbedBuilder().setColor("Blurple")
      .setAuthor({name: `Регистрация в системе`, iconURL: client.user.displayAvatarURL({dynamic:true})})
      .setDescription(`**Вы успешно зарегестрировались в системе \`${client.user.username}\`.**`)
      .setFooter({text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
      .setTimestamp()
      return interaction.reply({ embeds:[embed] })
    } else {
        interaction.reply({content: `**😪 | Вы уже зарегестрированны в системе, профиль: \`/profile\`.**`})
    }
  },
};
