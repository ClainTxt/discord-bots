const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js")
module.exports = {
    name: "messageDelete",
    async execute(message){
        if(message.author.bot) return;
        const parentChannel = message.channel.id;
        const embed = new EmbedBuilder()
        .setTitle("Event: Удаления сообщения")
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic:true}) })
        .addFields(
            {
                name: `Канал:`, value:`<#${parentChannel}>`
            },
            {
                name: `Автор:`, value: `<@${message.author.id}>`, inline: true
            },
            {
                name: `Контент:`, value: message.content, inline: true

            },
        )
        
        .setFooter({text: message.guild.name, iconURL: message.guild.iconURL({dynamic:true})})
        .setTimestamp()
        const channel = message.guild.channels.cache.find(x=>x.name == "deleted-messages")
        const parent = message.guild.channels.cache.find(x=> x.type == ChannelType.GuildCategory && x.name == "logs")
        if(!parent){ 
            console.log("category nety");
            await message.guild.channels.create({ 
                name: "logs",
                type: ChannelType.GuildCategory,
            });
        }
        else if(!channel){
            console.log("kanala nety");
            await message.guild.channels.create({ 
                name: "deleted-messages",
                type: ChannelType.GuildText,
                parent: parent,
                permissionOverwrites: [{ 
                    id: message.guild.id,
                    deny: PermissionFlagsBits.ViewChannel,
                }]
            });
        }
        else channel.send({embeds:[embed]})
    }
}