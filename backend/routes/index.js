const express = require('express');
const userRouter = require('./user');
const app = express();

const mainRouter = express.Router();

mainRouter.use('/user', userRouter)


module.exports = mainRouter;