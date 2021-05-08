const express = require('express');
const app = express();
const dbs = require('./dbConnect');
const requireAuth = require('./routes/authMiddleware');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');

dotenv.config({path: './.env'})


const db = dbs.getConnection();

app.use(express.static('../thebloodbank_main'));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());



db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("mysql connected");
    }
})



app.use('/', require('./routes/pages'))
app.use('/loginregister', require('./routes/pages'))

app.use('/auth', require('./routes/auth'))

app.use('/userpage', require('./routes/pages'))



app.listen(3000, ()=>{
    console.log("server started");
})