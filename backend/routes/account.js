const express = require('express')

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;
const SALT = 10;


router.get('/', async (req, res) => {
    res.send("Success!")
})


module.exports = router