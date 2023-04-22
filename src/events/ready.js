/*const botinfo = require(".././Models/botinfo");
const businesses = require("../Models/businesses");*/
const { mongoose } = require('mongoose');
require('dotenv').config();
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.mongodb || '',{
            keepAlive:true,
        })
        if(mongoose.connect){
            console.log('MongoDB успешно подключился!');
        }
        client.user.setActivity({name: `на ${client.guilds.cache.size} сервер(-ов) `, type: 3})
        console.log('Ready!');
        /* const binfo = await botinfo.findOne();
        const bizinfo = await businesses.find();
        if(binfo.status_finka === true) {
            const sb = bizinfo.map(n=> n.plus_time)
            if(Date.now() < sb){
                sb.l;
            }
        } else {

        } */
        // activities = ["House of Ashes", "Man Of Medan", "Little Hope", "Devil in Me"]
        
        // setInterval(() => {
        //     const option = activities[Math.floor(Math.random() * activities.length)];
        //     client.user.setPresence({activities: [{name: `${option}`,type: ActivityType.Playing}]})
        // }, 5000);
    }
};