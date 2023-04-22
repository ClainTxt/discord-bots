const { EmbedBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage){
        if(newMessage.author.bot) return;
        const parentChannel = newMessage.channel.id;
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Сообщение").setURL(newMessage.url).setStyle(ButtonStyle.Link)
        )
        const embed = new EmbedBuilder()
        .setTitle("Event: Изменения сообщения")
        .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL({dynamic:true}) })
        .setDescription(`**Канал: <#${parentChannel}>\nАвтор: <@${newMessage.author.id}>**`)
        .addFields(
            {
                name: `Старое сообщение:`, value: oldMessage.content, inline: true

            },
            {
                name: `Новое сообщение:`, value: newMessage.content,  inline: true

            },
        )
        
        .setFooter({text: newMessage.guild.name, iconURL: newMessage.guild.iconURL({dynamic:true})})
        .setTimestamp()
        const channel = newMessage.guild.channels.cache.find(x=>x.name == "update-messages")
        const parent = newMessage.guild.channels.cache.find(x=> x.type == ChannelType.GuildCategory && x.name == "logs")
        if(!parent){ 
            console.log("category nety");
            await newMessage.guild.channels.create({ 
                name: "logs",
                type: ChannelType.GuildCategory,
            });
        }
        else if(!channel){
            console.log("kanala nety");
            await newMessage.guild.channels.create({ 
                name: "update-messages",
                type: ChannelType.GuildText,
                parent: parent,
                permissionOverwrites: [{ 
                    id: newMessage.guild.id,
                    deny: PermissionFlagsBits.ViewChannel,
                }]
            });
        }
        else channel.send({embeds:[embed], components:[button]})
    }
}