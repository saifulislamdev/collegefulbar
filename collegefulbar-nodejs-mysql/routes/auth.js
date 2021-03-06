const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
//router for home page
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin', authController.admin);
router.post('/student', authController.student);




module.exports = router;