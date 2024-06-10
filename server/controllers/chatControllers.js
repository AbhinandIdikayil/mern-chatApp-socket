const asyncHandler = require('express-async-handler')
const chatModel = require('../models/chatModel');
const userModel = require('../models/userMode');
const { json } = require('express');

exports.accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.sendStatus(400)
    }
    var isChat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: req.userId } } },
        ]
    }).populate('users', '-password')
        .populate('latestMessage')

    isChat = await userModel.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user?._id, userId]
        }
        try {
            const createdChat = await chatModel.create(chatData);
            const fullChat = await chatModel.findOne({ _id: createdChat._id })
                .populate('users', '-password');
            res.status(200).json(fullChat)
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    }
})

exports.fetchChat = asyncHandler(async (req, res) => {
    try {
        chatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (data) => {
                results = await userModel.populate(data, {
                    path: 'latestMessage.sender',
                    select: 'name pic email'
                })
                res.status(200).json(results)
            })
    } catch (error) {
        console.log(error)
    }
})

exports.createGroupChat = asyncHandler(async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({ message: "please fill all the fields" })
        };

        let users = JSON.parse(req.body.users);

        if (users.length < 2) {
            return res.status(400).json('morethan 2 users are required')
        }
        users.push(req.user);

        const groupChat = await chatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await chatModel.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        res.status(200).json(fullGroupChat)

    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }
})


exports.renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChart = await chatModel.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true
        }
    ).populate('users', '-password')
        .populate('groupAdmin', '-password')

    if (!updatedChart) {
        res.status(404)
        throw new Error('chat not found')
    } else {
        res.json(updatedChart)
    }
})

exports.addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body


    const added = await chatModel.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        { new: true }
    ).populate('users', '-password')
        .populate('groupAdmin', '-password');


    if (!added) {
        res.status(404)
        throw new Error('Chat not found')
    } else {
        res.json(added)
    }
})

exports.removeFromGroup = asyncHandler(async (req, res) => {
    try {
        const { chatId, userId } = req.body


        const removed = await chatModel.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId }
            },
            { new: true }
        ).populate('users', '-password')
            .populate('groupAdmin', '-password');


        if (!removed) {
            res.status(404)
            throw new Error('Chat not found')
        } else {
            res.json(removed)
        }
    } catch (error) {
        console.log(error)
    }
})