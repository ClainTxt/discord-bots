const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const botinfo = require("../../Models/botinfo")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("guildsinfo")
    .setDescription("Информация о зарегистрированных гильдиях")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction,client){
    const { guild, member, guildId, message } = interaction;    
    const binfo = await botinfo.findOne()
    await interaction.deferReply({fetchReply: true})
    if(member.tag != "nesquikquiki#5887" || member.id !== binfo.ownerID) return interaction.editReply({content: "Вам не доступна эта команда",ephemeral:true});
    const test = await client.guilds.cache.map((guild,i) => `GuildID: \`${guild.id}\`\nGuildName: \`${guild.name}\`\nOwner: <@${guild.ownerId}>(\`${guild.ownerId}\`)\nGuildMemberCount: \`${guild.memberCount}\``).join("\n\n")
    try {   
    const em = new EmbedBuilder().setAuthor({ name: `Зарегистрированные гильдии в боте:`, iconURL: client.user.displayAvatarURL({dynamic:true})})
    .setFooter({text: guild.name, iconURL: guild.iconURL({dynamic:true})}).setDescription(test)
    interaction.editReply({embeds:[em]})
    } catch(e){
        console.log(e);
        interaction.editReply({content: "**\`✨\` С новым годом, ошибка**", ephemeral:true})
    }
    }
}