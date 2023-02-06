const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["manager", "employee"],
    default: "employee"
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model('User', userModel)