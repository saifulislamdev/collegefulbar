const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE 
    //to access the database in your end go to http://localhost/phpmyadmin/ 
    //but make sure you have xampp running with apache and mysql
});

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check if token exists

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        })

    }else{
        res.redirect('/login');
    }
}




module.exports = { requireAuth};