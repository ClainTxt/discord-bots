const { SlashCommandBuilder,PermissionFlagsBits,EmbedBuilder} = require("discord.js");
const sSchema = require("../../Models/Shop");
const uSchema = require("../../Models/user")
const css = require("../../Models/commands");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Покупка дополнительных ролей за коины")
    .addRoleOption((option) =>
    option
        .setName("роль")
        .setDescription("Выберите роль которую хотите купить за коины")
    ),
    async execute(interaction, client) {
        const { options, guildId, member, guild} = interaction;
        const embed = new EmbedBuilder().setColor("Blurple")
        const role = options.getRole("роль");
        try {
        await interaction.deferReply({fetchReply:true})   
        const cs = await css.findOne({ gid: guild.id })
        if( cs.shop_status == "Выключена 🔴" ) return interaction.editReply("**😪 | Команда \`(/shop)\` выключена администрацией Discord сервера.**")
        const data = await sSchema.findOne({ GuildID: guild.id });
        const user = await uSchema.findOne({  gid: guildId, uid: member.id ,})
            
        if(!user) return interaction.editReply("**😪 | Вы не зарегестрированны в системе. Пропишите команду \`/register.\`**")
        if (!data) return interaction.editReply("**😪 | На данный момент в магазине ролей в продаже не обнаружено.**");
        embed
        .setAuthor({ name: `${guild.name} ・ Магазин ролей`, iconURL: guild.iconURL({dynamic:true})})
        .setTimestamp()
        .setFooter({ text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
        if(!role) {
            const send = data.roles.map((name, index, array) => `** ${guild.roles.cache.get(data.roles[index].roleId)} » \`${data.roles[index].rolePrice}\` 💸**`).join("\n")
            embed.setDescription(`${send}\n\n**Для покупки ролей пропишите - \`/shop @упоминание-роли\`.**\n**Магазин ролей настраивает __администрация Discord сервера__.**`)
            return interaction.editReply({ embeds:[embed]})}
        else {
            let roleData = data.roles.find((x) => x.roleId === role.id);
            if (roleData) {
                if(member.roles.cache.has(roleData.roleId)) return interaction.editReply("**😪 | У вас уже присутствует указанная вами роль из магазина!**")
                if (role.position > guild.members.me.roles.highest.position ) return interaction.editReply({content:"Произошла ошибка(||роль выше роли бота||) выдачи роли, __сообщите администрации Discord`a__"});
                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.editReply("Произошла ошибка(||у бота нету прав выдачи||) выдачи роли, __сообщите администрации Discord`a__")
                if (!role.position >= member.roles.highest.position) return interaction.editReply({content:"Произошла ошибка(||у пользователя нет ролей||) выдачи роли, __сообщите администрации Discord`a__"});
                // if (!role.position <= member.roles.highest.position) return interaction.editReply({content:"Произошла ошибка2 выдачи роли, __сообщите администрации Discord`a__"});
                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.editReply("Произошла ошибка(||у бота нету прав выдачи роли||) выдачи роли, __сообщите администрации Discord`a__")
                if(user.eco.balance < roleData.rolePrice) return interaction.editReply(`**😪 | У вас не хватает коинов! Сейчас у вас: \`${user.eco.balance}\` 💸, а нужно: \`${roleData.rolePrice}\` 💸**`)
                await member.roles.add(roleData.roleId).catch(e=>interaction.editReply(`Ошибка ${e}`));
                user.eco.balance -= parseInt(roleData.rolePrice);
                embed.setColor("Blurple").setDescription(`**» Вы успешно приобрели роль <@&${roleData.roleId}> (\`${roleData.roleId}\`) за ${roleData.rolePrice} 💸**`)
                interaction.editReply({embeds:[embed]})
                await user.save();
            } else {
                return interaction.editReply("**😪 | Указанная вами роль не продаётся, список продаваемых ролей: \`/shop [без аргументов]\`.**")
            }
        }
    }   catch (err) {
            console.log(err);
        }
    }
};