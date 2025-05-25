const mongoose = require('mongoose')

const connectToDB = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/Mini-Project")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("Error in conning to DB",err);
    })
}

module.exports = connectToDB