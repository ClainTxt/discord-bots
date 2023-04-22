const { Schema, model } = require("mongoose");

let shopSchema = new Schema({
    GuildID: String,
    roles: Array,
});
module.exports = model('Shop', shopSchema)