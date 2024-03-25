const express = require('express');
const userRouter = require('./user');
const accountRouter = require('./account');
const app = express();

const mainRouter = express.Router();

mainRouter.use('/user', userRouter)
mainRouter.use('/account', accountRouter)


module.exports = mainRouter;