const router = require('express').Router()
const { registerUser, loginUser, refreshTokenGen, logoutUser } = require('../controllers/userController')

router.post('/register', registerUser).post('/login', loginUser).post('/refresh', refreshTokenGen).post('/logout', logoutUser)


module.exports = router