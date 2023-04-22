const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const commands = require("../../Models/commands");
const guilds = require("../../Models/guilds");
const moneysettings = require("../../Models/moneysettings");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("fixserver")
    .setDescription("Добавить сервер в базу данных")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction,client){
    const { guild, member, guildId, message } = interaction;    
    const ginfo = await guilds.findOne({ gid: guild.id })
    const cinfo = await commands.findOne({ gid: guild.id })
    const minfo = await moneysettings.findOne({ gid: guild.id})
    await interaction.deferReply({fetchReply: true})
    try {   
        if(!ginfo) {
            await guilds.create({
            gid: guild.id,
            ownerId: guild.ownerId 
        })
        interaction.editReply("**💨 | Сервер успешно добавлен в базу данных**")
        }
        else if (!cinfo) {
            await commands.create({
                gid: guild.id
            })
        interaction.editReply("**💨 | Сервер успешно добавлен в базу данных**")
        }
        else if (!minfo) {
            await moneysettings.create({
                gid: guild.id
            })
        interaction.editReply("**💨 | Сервер успешно добавлен в базу данных**")
        }
        else interaction.editReply("**💨 | Сервер уже есть все ок**")

    } catch(e){
        console.log(e);
        interaction.editReply({content: "**\`✨\` С новым годом, ошибка**", ephemeral:true})
    }
    }
}