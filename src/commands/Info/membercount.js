const { EmbedBuilder, SlashCommandBuilder, InteractionCollector } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Узнать количество участников на сервере"),
    async execute(interaction, client){
        const { guild } = interaction;
        const embed = new EmbedBuilder().setTitle("Total Members:").setDescription(`${guild.memberCount}`)
        return interaction.reply({embeds:[embed]})
    }
}