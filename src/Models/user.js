const { model, Schema } = require("mongoose");
const findorcreate = require('mongoose-findorcreate');

let userModule = new Schema({
  gid: { type: Number, default: null},
  uid: { type: Number, default: null },
  tag: {type: String, default: undefined},
  eco: {
    balance: { type: Number, default: 0 },
    timelyTime: { type: Number, default: 0 },
    worktime: { type: Number, default: 0},
    workTimes: { type: Number, default: 0},
    robTimes: { type: Number, default: 0},
    rpsTimes: { type: Number, default: 0},
    bonusTimes: { type: Number, default: 0},
  },
  register_time: {type: String},
  premium: {type: Boolean, default: false},
  avatarURL: {type: String},
  game: {
    who: {type: String, default: ""},
    status: {type: Boolean, default: false},
    bet: {type: Number, default: 0},
    result: {type: Number, default: 0},
    id: {type: Number, default: 0},
  }
});
userModule.plugin(findorcreate);
module.exports = model("User", userModule);
