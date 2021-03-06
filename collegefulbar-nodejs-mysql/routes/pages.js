const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAuthAdmin } = require('../middleware/adminaccess');

//router for home page
router.get('/',(req,res)=>{
    res.render('index');
});
//router for register
router.get('/register',(req,res)=>{
    res.render('register');
});

//router for login
router.get('/login',(req,res)=>{
    res.render('login');
});

//router for admin
router.get('/admin',requireAuthAdmin, (req,res)=>{
    res.render('admin');
});

//router for student
router.get('/student',requireAuth, (req,res)=>{
    res.render('student');
});

router.get('/logout',(req,res) => {
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/');
})


module.exports = router;