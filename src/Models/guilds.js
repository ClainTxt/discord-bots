const { model, Schema } = require("mongoose");
const findorcreate = require("mongoose-findorcreate");

let guildModel = new Schema({
    gid: String,
    ownerId: String,
    status_finka: { type: Boolean, default: false},
});
guildModel.plugin(findorcreate);
module.exports = model("guilds", guildModel);
