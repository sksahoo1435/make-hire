const express = require('express');
const routes = express.Router();
const authController = require('../controller/Auth');

routes
.post('/signUp',authController.signUp)
.post('/login',authController.logIn)

exports.authRouter = routes;