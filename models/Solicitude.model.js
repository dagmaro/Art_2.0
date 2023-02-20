const mongoose = require("mongoose")

const solicitudeSchema = new mongoose.Schema({
  credit: Number,
  pendingApproval: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const Solicitude = mongoose.model("Solicitude", solicitudeSchema)
module.exports = Solicitude