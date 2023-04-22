const { SlashCommandBuilder, EmbedBuilder, Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const userModel = require("../../Models/user")
const css = require("../../Models/commands");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Начать заработок коинов."),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
    const { member, guild, guildId } = interaction;
    await interaction.deferReply({ fetchReply:true })
    const cs = await css.findOne({ gid: guild.id })
    if( cs.work_status == "Выключена 🔴" ) return interaction.editReply("**😪 | Команда \`(/work)\` выключена администрацией Discord сервера.**")
    const modelUser = await userModel.findOne({ gid: guild.id, uid: member.id})
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("yes-work").setLabel("Да").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("no-work").setLabel("Нет").setStyle(ButtonStyle.Danger),
    )
    if(!modelUser) return interaction.editReply({content:"**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**"})
    if (Date.now() < modelUser.eco.worktime) {
      {
        const now = new Date(modelUser.eco.worktime)
        return interaction.editReply(`😪** | Не так быстро! Можешь использовать команду \`${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\`** `);
      }
    } else {
      embed.setTimestamp().setAuthor({name: member.displayName, iconURL: member.displayAvatarURL({dynamic:true})})
      .setDescription(`**💰 | Вы пришли в центр занятости, и менеджер предложил вам работу.\nВы согласны __начать свой рабочий день__?\n\n👤 | __Ваш индификатор работника:__**\n${member.id}`)
      .setFooter({text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
      modelUser.eco.worktime = Date.now() + 300000;
      modelUser.save()
      interaction.editReply({ embeds: [embed], components:[button] });
      
    }
  },
};
