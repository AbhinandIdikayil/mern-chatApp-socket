const express = require('express')
const { chats } = require('./data/data')
const dotenv = require('dotenv')
const cors = require('cors')
const {connectDB} = require('./config/db')
dotenv.config()
const app = express()


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
    credentials: true // Allow cookies to be sent with requests
}));

const PORT = process.env.PORT || 3000

app.get('/api/chat',(req,res) => {
    res.status(200).json(chats)
})

app.listen(PORT,() => {
    connectDB()
    console.log(`server is running on ${PORT}`)
})