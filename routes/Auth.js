const express = require('express');
const routes = express.Router();
const authController = require('../controller/Auth');

routes
.post('/signUp',authController.signUp)
.post('/login',authController.logIn)
.post('/logout',authController.logOut)

exports.authRouter = routes;