const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const blacklist = []

const generateToken = (user, exp, sec) => {
  return jwt.sign({ _id: user._id, name: user.name, email: user.email }, sec, { expiresIn: exp })
}

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" })
    }
    let user = await userModel.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: "user already exists with this email address, please provide a new email" })
    }
    user = new userModel({ name, email, password, role })
    const salt = await bcrypt.genSalt(5)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    return res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ err: err.message })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.findOne({ email, password })
    if (user) {
      const token = generateToken(user, "1m", "somejwtkey")
      const refreshToken = generateToken(user, "5m", "somerefreshjwtkey")
      return res.status(201).json({ msg: "login success", token, refreshToken })
    } else {
      return res.status(401).json({ msg: "invalid credentials" })
    }
  } catch (err) {
    return res.send(501).json({ err })
  }
}

const refreshTokenGen = async (req, res) => {
  const refreshToken = req.headers["authorization"]
  try {
    if (!refreshToken) {
      return res.status(401).send("unauthorized")
    }
    try {
      const verification = jwt.verify(refreshToken, "somerefreshjwtkey")
      if (verification) {
        const newToken = generateToken(user, "1m", "somejwtkey")
        return res.status(201).json({ token: newToken })
      }
    } catch (err) {
      return res.status(401).json({ err: "invalid token" })
    }
  } catch (err) {
    return res.status(500).json({ err })
  }
}

const logoutUser = (req, res) => {
  const token = req.body.token
  const refreshToken = req.body.refreshToken
  try {
    blacklist.push(token)
    blacklist.push(refreshToken)
    return res.json(201).json({ msg: "successfully logged out" })
  } catch (err) {
    return res.status(500).json(err)
  }
}

module.exports = { registerUser, loginUser, refreshTokenGen, logoutUser }