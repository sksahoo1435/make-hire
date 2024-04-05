const express = require('express');
const routes = express.Router();

const userController = require('../controller/user');

routes
.get('/employee',userController.getAllUserEmployee)
.get('/employer',userController.getAllUserEmployer)
.get('/employee/:id',userController.getUserEmployee)
.get('/employer/:id',userController.getUserEmployer)
.delete('/:id',userController.deleteUser)
.put('/:id',userController.updateUser)

exports.userRouter = routes;
