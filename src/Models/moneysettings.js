
const { model, Schema } = require("mongoose");
const findorcreate = require("mongoose-findorcreate");

let moneyModel = new Schema({
    gid: String,
    work_min: {type: Number, default: 50},
    work_max: {type: Number, default: 500},
    bonus_min: {type: Number, default: 50},
    bonus_max: {type: Number, default: 500},
});
moneyModel.plugin(findorcreate);
module.exports = model("MoneySet", moneyModel);
