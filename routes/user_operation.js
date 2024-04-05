const express = require('express');
const routes = express.Router();
const userOperationController = require('../controller/user_operation');
routes
    .get('/filter', userOperationController.getUsersByFilter)
    .get('/search', userOperationController.getUsersBySearching)
    .get('/sort', userOperationController.getUsersBySorting)


exports.userOperationRouters = routes;