const UserModel = require('../models/userMode')
const asyncHandler = require('express-async-handler')
const generateToken = require('../config/generateToken')


exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        res.status(400)
        throw new Error('user already exists');
    }

    const user = await UserModel.create({
        name,
        email,
        password
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            pic:user.pic
        })
    } else {
        res.status(400)
        throw new Error('Failed to create user')
    }

})


exports.authUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        let user = await UserModel.findOne({ email })
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic:user?.pic,
                token: generateToken(user._id),
            })
        }
    } catch (error) {
        console.log(error)
    }
})

exports.allUsers = asyncHandler(async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ]
        } : {};
        const user = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } });

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
})
