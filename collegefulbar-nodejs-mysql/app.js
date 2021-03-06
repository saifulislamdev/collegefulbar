//all our required imports 
const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

//hide sensitive password and other information file
dotenv.config({path: './.env'});

//create server connection with express
const app = express();

//establish database connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE 
    //to access the database in your end go to http://localhost/phpmyadmin/ 
    //but make sure you have xampp running with apache and mysql
});

//where the css and other styling materials will be in
//dirname gives the location of curent directory 
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//to get data from pages through parsing 
app.use(express.urlencoded({extended: false}));
//the values we are grabbing must come in json
app.use(express.json());
app.use(cookieParser());

//use hbs template for html formats for the front end views 
//index.hbs will be our home page
app.set('view engine', 'hbs');

//actual connection to db
db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL DATABASE CONNECTED")
    }

})

//define Routes 
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(5000,() =>{

    console.log("server started on port 5000");
})