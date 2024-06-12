const asyncHandler = require("express-async-handler");
const { MessageModel } = require('../models/messageModel');
const userMode = require("../models/userMode");
const chatModel = require("../models/chatModel");


exports.sendMessage = asyncHandler(async (req, res) => {
    try {
        const { content, chatId } = req.body
        if (!content || !chatId) {
            return res.status(400).json('invalid data')
        }
        let newMessage = {
            sender: req.user._id,
            content,
            chat: chatId
        }
        let message = await MessageModel.crate(newMessage)
        message = await message.populate('sender', 'name pic');
        message = await message.populate('chat');
        message = await userMode.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });
        await chatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
    }
})

exports.allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await MessageModel.find({ chat: req?.params?.chatId })
            .populate('sender', 'name pic email')
            .populate('chat');
        
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
    }
})