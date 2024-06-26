const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        if(conn){
            console.log('mongodb connected');
        }
    } catch (error) {
        console.log(error);
        process.exit()
    }
}

module.exports = {
    connectDB
}