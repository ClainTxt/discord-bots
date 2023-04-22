
const { model, Schema } = require("mongoose");
const findorcreate = require('mongoose-findorcreate');

let botSchema = new Schema({
    ownerID: {type: String, default: "1010224290374893709"},
    lastUpdate: {type: String},
    lastVersion: String,
    status_finka: {type: Boolean, default: false}
});
botSchema.plugin(findorcreate);
module.exports = model("Binfo", botSchema);
