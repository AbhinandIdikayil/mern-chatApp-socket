const express = require('express')
const { chats } = require('./data/data')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.get('/api/chat',(req,res) => {
    res.send(chats)
})

app.listen(PORT,() => {
    console.log(`server is running on ${PORT}`)
})