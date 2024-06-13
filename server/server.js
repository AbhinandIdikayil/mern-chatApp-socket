const express = require('express')
const { chats } = require('./data/data')
const dotenv = require('dotenv')
const cors = require('cors')
const { connectDB } = require('./config/db')
const { userRoute } = require('./routes/userRoute')
const { notFound, errorHandler } = require('./middleware/erroMiddleware')
const { chatRouter } = require('./routes/chatRoute')
const { messageRouter } = require('./routes/messageRoute')
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

// app.get('/api/chat',(req,res) => {
//     res.status(200).json(chats)
// })

app.use('/api/user', userRoute);
app.use('/api/chat', chatRouter)
app.use('/api/message',messageRouter)

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
    connectDB()
    console.log(`server is running on ${PORT}`)
})
 
const io = require('socket.io')(server,{
    cors: {
        origin: 'http://localhost:5173'
    },
});

io.on('connection',(socket) => {
    console.log('connected to socket.io');
 
    socket.on('setup',(userData) => {
        socket.join(userData._id);
        socket.emit('connected')
    })

    socket.on('join chat',(room) => {
        socket.join(room)
        console.log('user joined',room)
    })

    socket.on('new message',(newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if(!chat.users) return console.log('chat.user not defined');

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved)
        })
    })

    socket.on('typing',(room) => socket.in(room).emit('typing'))
    socket.on('stop typing',(room) => socket.in(room).emit('stop typing'))

    socket.on('disconnect', (reason) => {
        console.log(`Socket ${socket.id} disconnected:`, reason);
    });
}) 