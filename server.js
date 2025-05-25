const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

const connectToDB = require('./config/db')
const userRoute = require('./routes/user.route')
const postRoute = require('./routes/post.route')


app.set("view engine","ejs")
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/',userRoute)
app.use('/',postRoute);

app.listen(3000, () => {
    connectToDB()
  console.log("Server is running on http://localhost:3000");
});