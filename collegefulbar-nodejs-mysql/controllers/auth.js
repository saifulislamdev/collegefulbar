const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE 
    //to access the database in your end go to http://localhost/phpmyadmin/ 
    //but make sure you have xampp running with apache and mysql
});
exports.admin = async(req,res) =>{
  
}

exports.student = async(req,res) =>{
    
}


exports.login = async (req,res) => {
    try {
        const {account, email, password} = req.body;
        if( !email || !password || !account){
            return res.status(400).render('login',{
                message: 'Fields can not be empty'
            })
        }
        db.query('SELECT * FROM user WHERE email = ?', [email], async(error,results)=>{
            console.log(results);
            if(results == 0){
                res.status(401).render('login',{
                    message:'Account does not exist'
                })
            }
            if (!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login',{
                    message:'Email or password is Incorrect'
                })
            }else{
                const id = results[0].id;
                const account = results[0].account;
                if(account == "student" || account == "Student"){
                    const token = jwt.sign({id: id},process.env.JWT_SECRET,{
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log("The Token is "+ token);
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('jwt',token, cookieOptions);
                    res.status(200).redirect("/student");
                };

                if(account == "admin" || account == "Admin"){
                    const token = jwt.sign({id: id},process.env.JWT_SECRET_ADMIN,{
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log("The Token is "+ token);
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('jwt',token, cookieOptions);
                    res.status(200).redirect("/admin");
    
                }

               
            }
        })
    
    } catch (e) {
    console.log(error);
    res.status(401).render('login',{
        message:'Account does not exist'
    })
    }

}

exports.register = (req,res) => {
    console.log(req.body);

    const name = req.body.name;
    const account = req.body.account;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    //this is where we will take in the  email the user enters in the form and put inside our database and 
    //if the email already exists then show them the message
    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0) {
            return res.render('register',{
                message: 'The email already exists'
            })
        }else if (password !== passwordConfirm){
            return res.render('register',{
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        //insert into database
        db.query('INSERT INTO user SET ?',{name: name, account: account, email: email, password: hashedPassword},(error,results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('register', {
                    message: 'User Registered'
                });
            }
        })
    });
}