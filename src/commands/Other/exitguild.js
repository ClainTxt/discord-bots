const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, GuildScheduledEvent} = require("discord.js");
const botinfo = require("../../Models/botinfo")
module.exports = {
    data: new SlashCommandBuilder()
    .setName("exitguild")
    .setDescription("Выйти с гильдии")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
    option
      .setName("guildid")
      .setDescription("Укажите ID гильдии.")
      .setRequired(true)
    ),
    async execute(interaction,client){
        const { options,member } = interaction;
        const binfo = await botinfo.findOne()
        if(member.id !== binfo.ownerID) return interaction.reply({content: "Вам не доступна эта команда",ephemeral:true});
        const guild_id = options.getString("guildid")
        if(!client.guilds.cache.get(guild_id)) return interaction.reply("Меня нету в этой гильдии")
        const embed = new EmbedBuilder()
        .setDescription(`**・Я успешно вышел с гильдии **`)
        .addFields(
            {name: "ID:", value:`${guild_id}`},
            {name: "Name:", value:`${client.guilds.cache.get(guild_id).name}`}
        )
        var guildID = client.guilds.cache.get(guild_id) //your argument would be the server id
        guildID.leave()
        return interaction.reply({embeds:[embed], ephemeral:true})
    }
}