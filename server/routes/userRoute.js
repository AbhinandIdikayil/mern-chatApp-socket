const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userContollers')
const { protect } = require('../middleware/authMiddleware')
const userRoute = express.Router()


userRoute.route('/login')
    .post(authUser)
userRoute.route('/')
    .post(registerUser)
    .get(protect, allUsers)

module.exports = {
    userRoute
}