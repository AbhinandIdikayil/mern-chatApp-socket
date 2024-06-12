const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { accessChat, fetchChat, createGroupChat ,renameGroup , addToGroup , removeFromGroup } = require('../controllers/chatControllers')
const chatRouter = express.Router()


chatRouter.route('/').post(protect, accessChat);
chatRouter.route('/').get(protect, fetchChat)
chatRouter.route('/group').post(protect, createGroupChat)
chatRouter.route('/rename').put(protect ,renameGroup)
chatRouter.route('/groupadd').put(protect, addToGroup)
chatRouter.route('/groupremove').put(protect , removeFromGroup)


module.exports = {
    chatRouter
}   