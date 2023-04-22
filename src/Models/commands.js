const { model, Schema } = require("mongoose");
const findorcreate = require("mongoose-findorcreate");

let cmdModel = new Schema({
    gid: String,
    work_status: {type: String, default: "Включена 🟢"},
    bonus_status: {type: String, default: "Включена 🟢"},
    rob_status: {type: String, default: "Включена 🟢"},
    register_status: {type: String, default: "Включена 🟢"},
    shop_status: {type: String, default: "Включена 🟢"},
});
cmdModel.plugin(findorcreate);
module.exports = model("Commands", cmdModel);
