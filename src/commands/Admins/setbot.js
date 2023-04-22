
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const botinfo = require("../../Models/botinfo");
const pjson = require("../../../package.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("setbot")
    .setDescription("Настройка бота")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o=>o.setName("pjsv").setDescription("set pjsv").setRequired(true))
    ,
    async execute(interaction, client){
        function randomSymbols() {
            var length = 8,
                charset = '"!@#$%^&*()_+=-"',
                retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
        }
        const { options, member, guild, guildId} = interaction;
        const binfo = await botinfo.findOne();
        const symbols = ''
        const version = options.getString("pjsv");
        const time = new Date();
        if(!binfo) {
            botinfo.create({
                ownerID: "1010224290374893709",
                lastUpdate: time,
                lastVersion: version,
            })
        }
        else {
        let j = randomSymbols()
        if(member.id !== binfo.ownerID) return interaction.reply({content:`${j} Error`, ephemeral:true});
        if(pjson.version !== version) {
            pjson.version = version;
            binfo.lastUpdate = time;
            binfo.lastVersion = pjson.version;
            binfo.save();
            interaction.reply(`**🩱 | Вы установили новое значение версии бота.(\`${pjson.version}\`)**`);
        }}
    }
}