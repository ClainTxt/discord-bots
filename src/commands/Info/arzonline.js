const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
module.exports = {
    data: new SlashCommandBuilder().setName("arzonline").setDescription("Получить онлайн аризоны"),
    async execute(interaction, client) {
        const { options, member, guild, user, channel } = interaction;
        try {
            const embed = new EmbedBuilder();
            const discordArray = [
                {emoji: "1084502366654570607", discord: "https://discord.gg/CvN4AaMdwe"},
                {emoji: "1084502379350736958", discord: "https://discord.gg/tucson"},
                {emoji: "1084502389098291310", discord: "https://discord.gg/WVNBNUnHpr"},
                {emoji: "1084502409482616964", discord: "https://discord.gg/d7cJKa9"},
                {emoji: "1084502418550693969", discord: "https://discord.gg/brainburg"},
                {emoji: "1084502427295830026", discord: "https://discord.gg/saintrose"},
                {emoji: "1084502441078296837", discord: "https://discord.gg/ZCJx7T5"},
                {emoji: "1084502451555667968", discord: "https://discord.gg/kp7ENmW"},
                {emoji: "1084502473730949181", discord: "https://discord.gg/29Ac9vxFvS"},
                {emoji: "1084502462049816596", discord: "https://discord.gg/tRtNkVq"},
                {emoji: "1084502485458243665", discord: "https://discord.gg/3yawqzxG7d"},
                {emoji: "1084502495671361536", discord: "https://discord.gg/nQaznGz"},
                {emoji: "1084502525392199710", discord: "https://discord.gg/kDVyX2K"},
                {emoji: "1084502554769096764", discord: "https://discord.gg/winslow"},
                {emoji: "1084502574226489435", discord: "https://discord.gg/HwHxxVkxBc"},
                {emoji: "1084502586872315995", discord: "https://discord.gg/HrX_sMHNUf4"},
                {emoji: "1084502597173522633", discord: "https://discord.gg/arz17"},
                {emoji: "1084502610922459159", discord: "https://discord.gg/yBW4MSYjNP"},
                {emoji: "1084502649505853600", discord: "https://discord.gg/WzbNWcKQnr"},
                {emoji: "1084502664294969355", discord: "https://discord.gg/JA6FubbMad"},
                {emoji: "1084518435532316742", discord: "https://discord.gg/5ME9YRjP4t"},
                {emoji: "1084518396307185807", discord: "https://discord.gg/hV65kFRKyh"},
                {emoji: "1084502724302872626", discord: "https://discord.gg/holiday23"},
                {emoji: "1084518347598725261", discord: "https://discord.gg/V8PChk6FtY"},
            ]
            interaction.reply({ content: "Loading...", ephemeral: true });
            await axios
                .get(`https://arizona-ping.react.group/desktop/ping/Arizona/ping.json`)
                .then(function (response) {
                    const d1 = response.data;
                    const sd = d1["query"].sort((a, b) => a["number"] - b["number"]);
                    // console.log(sd);
                    let text = sd.map((x, i) => `<:arzC_${x["number"]}:${discordArray[i].emoji}> **${x["name"]} ${x["password"] ? "🔐" : "🔓"}**
Количество игроков: ${x["online"]}/${x["maxplayers"]}
IP: ${x['ip']}:${x['port']}
VK: ${x['vk']}
Discord: ${discordArray[i].discord}`).join('\n\n')
                    embed.setDescription(text+"\0")
                    interaction.channel.send({embeds: [embed]}).then(m=>{
                        setInterval(async () => {
                            await axios.get(`https://arizona-ping.react.group/desktop/ping/Arizona/ping.json`)
                            .then(function (response) {
                                const at = new Date()
                                const d1 = response.data;
                                const sd = d1["query"].sort((a, b) => a["number"] - b["number"]);
                                let text = sd.map((x, i) => `<:arzC_${x["number"]}:${discordArray[i].emoji}> **${x["name"]} ${x["password"] ? "🔐" : "🔓"}**
Количество игроков: ${x["online"]}/${x["maxplayers"]}
IP: ${x['ip']}:${x['port']}
VK: ${x['vk']}
Discord: ${discordArray[i].discord}`).join('\n\n')
                                embed.setDescription(text).setFooter({text: `Обновлено: ${at.getHours()}:${at.getMinutes()}:${at.getSeconds()}`})
                                m.edit({embeds: [embed]})
                            })
                        }, 30000);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
            interaction.reply(`${error}`);
        }
    },
};
