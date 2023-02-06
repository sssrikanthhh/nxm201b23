const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://192.168.1.11:27017/c2")
    console.log('==> Database Connected <==')
  } catch (err) {
    console.log(err)
  }
}

module.exports = connectDB