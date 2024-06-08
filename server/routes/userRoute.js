const express = require('express')
const { registerUser ,  authUser} = require('../controllers/userContollers')

const userRoute = express.Router()


userRoute.route('/login').post(authUser)
userRoute.route('/signup').post(registerUser)

module.exports = {
    userRoute
}