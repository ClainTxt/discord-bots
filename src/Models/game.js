const { model, Schema } = require("mongoose");
const findorcreate = require("mongoose-findorcreate");

let gameModel = new Schema({
    gid: String,
    uid: { type: Number, default: null },
    messageID: {type: String, default: undefined},
});
gameModel.plugin(findorcreate);
module.exports = model("Game", gameModel);
