
module.exports = {
    name: "guildDelete",
    async execute(guild,client) {
        client.user.setActivity({name: `на ${client.guilds.cache.size} сервер(-ов) `, type: 3})
    }
}
