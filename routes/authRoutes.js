const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

//Registro
router.post('/signup',authController.singnup);
//Login
router.post('/signin',authController.signin);

module.exports = router;

