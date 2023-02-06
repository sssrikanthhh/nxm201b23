const express = require('express')
const jwt = require('jsonwebtoken')
const connectDB = require('./configs/db')
const userRoutes = require('./routes/userRoutes')
const authMiddleware = require('./middlewares/authMiddleware')
const port = process.env.port || 8080
const app = express()
app.use(express.json())

connectDB()
app.use('/users', userRoutes)

app.get("/goldrate", authMiddleware, (req, res) => {
  res.json({ msg: "gold rates" })
})

app.get('/userstats', (req, res) => {
  const token = req.headers["authorization"]
  jwt.verify(token, "somejwtkey", (err, data) => {
    if (err) {
      res.status(400).json(err)
    }
    if (data.role === "manager") {
      res.status(201).json({ msg: "user stats" })
    } else {
      res.status(401).json({ msg: "only manager can see the user stats" })
    }
  })
})
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`)
})