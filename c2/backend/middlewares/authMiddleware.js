const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]
  try {
    jwt.verify(token, "somejwtkey", (err, data) => {
      if (err) {
        return res.status(400).json({ msg: "only logged in users can view this page" })
      }
      req.body.role = data.role
      next()
    })
  } catch (err) {
    return res.status(400).json(err)
  }
}

module.exports = authMiddleware