const {
  SlashCommandBuilder,
  RoleSelectMenuBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const Shop = require("../../Models/Shop");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setshop")
    .setDescription("Настроить магазин ролей")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(s=>
      s.setName("add")
      .setDescription("Добавить новую роль в продажи за коины.")
      .addRoleOption(r=>r.setName("роль").setDescription("Укажите роль для добавления").setRequired(true))
      .addNumberOption((option) => option.setName("цена").setDescription("Укажите цену за роль.").setRequired(true))
    )
    .addSubcommand(a=>
      a.setName("dell")
      .setDescription("Удалить роль из продажи за коины.")
      .addRoleOption(r=>r.setName("роль").setDescription("Укажите роль которую хотите удалить.").setRequired(true))
    )
    .addSubcommand(a=>a.setName("edit").setDescription("Изменение цены для покупки роли.")
    .addRoleOption(r=>r.setName("роль").setDescription("Укажите роль которой хотите изменить цену").setRequired(true))
    .addNumberOption(n=>n.setName("цена").setDescription("Укажите новую стоимость данного товара (бесплатно - 0).").setRequired(true))
    )
    .addSubcommand(a=>
      a.setName("reset")
      .setDescription("Сбросить все роли в магазине")
    )
    ,
  async execute(interaction, client) {
    const { options, guildId, member, guild } = interaction;
    const s = new EmbedBuilder().setColor("Blurple").setAuthor({ name: guild.name}).setTimestamp().setFooter({ text: `Support https://discord.gg/GURtbqsBAW`, iconURL: client.user.displayAvatarURL({dynamic:true})})
    let shop = await Shop.findOne({ GuildID: guildId });
    const role = options.getRole("роль")
    const price = options.getNumber("цена")
    const sub = options.getSubcommand(["add", "dell", "edit", "reset"])
    let roleData
    let newRole
    try {
      await interaction.deferReply({fetchReply: true})
      switch (sub) {
        case "add": 
        newRole = { roleId: role.id, rolePrice: price };
        if (!role.position >= member.roles.highest.position) return interaction.editReply({content:"Нету прав для этого",ephemeral:true});
        if (shop) {
          roleData = shop.roles.find((x) => x.roleId === role.id);
          if (roleData) {
            s.setDescription("**😪 | Эта роль уже есть в магазине.**")
            return interaction.editReply({embeds:[s]})
          } else {
            shop.roles = [...shop.roles, newRole];
          }
          await shop.save();
        } else {
          await Shop.create({
            GuildID: guildId,
            roles: newRole,
          });
        }       
        s.setDescription(`**Вы успешно добавили товар ${guild.roles.cache.get(role.id)} который стоит: \`${price}\` 💸**`)
        interaction.editReply({embeds: [s]}); 
        break;
        case "edit":
          if(shop) roleData = shop.roles.find((x) => x.roleId === role.id);
          else if(!shop) return interaction.reply({content:"**😪 | Указанная роль не находится в магазине! Для создания пропишите \`/setshop add\`.**",ephemeral:true})
          if(roleData){
            var editedUser = { roleId: role.id, rolePrice: price};
            shop.roles = shop.roles.map(u => u.roleId !== editedUser.roleId ? u : editedUser);
            s.setDescription(`**Вы успешно изменили товар ${guild.roles.cache.get(role.id)}. Теперь его цена \`${price}\`💸**`)
            interaction.editReply({embeds:[s]})
            shop.save();
          } else return interaction.editReply("**😪 | Указанная роль не находится в магазине! Для создания пропишите \`/setshop add\`.**")
          break;
        case "reset":
            if(shop) {await Shop.findOneAndDelete({ GuildID: guildId })
            s.setDescription("**🚮 | Вы сбросили магазин ролей, теперь он пуст.**")
            interaction.editReply({embeds:[s]})}
            else s.setDescription("**😪 | В магазине и так нету ролей, вам нечего удалять.**"); interaction.editReply({embeds:[s]})
        break;
        case "dell":
        if (!shop) {
          return interaction.editReply({ content: "**😪 | Указанная роль не находится в магазине! Для создания пропишите \`/setshop add\`.**"});
        }
        const roles = shop.roles;
        const findRole = roles.find((r) => r.roleId === role.id);
        if (!findRole) { s.setDescription("** 😓 | Этой роли нету в магазине.**"); return interaction.editReply({ embeds:[s] });}
        const filteredRoles = roles.filter((r) => r.roleId != role.id);
        shop.roles = filteredRoles;
        await shop.save()
        s.setDescription(`**Вы успешно удалили товар ${guild.roles.cache.get(role.id)}. Теперь он не доступен для покупки.**`)
        interaction.editReply({ embeds:[s] });
        break;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
