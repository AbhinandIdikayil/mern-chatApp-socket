const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { sendMessage , allMessage } = require('../controllers/messageController')
const messageRouter = express.Router()


messageRouter.route('/').post(protect , sendMessage)
messageRouter.route('/:chatId').get(protect , allMessage)


module.exports = {
    messageRouter
}