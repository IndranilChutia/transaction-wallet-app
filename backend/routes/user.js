const express = require('express');
const { z } = require('zod');
const { userModel } = require('../db');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const signupBody = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(3).trim(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4,
        { message: "Password must be longer than 4 Characters!" }),
})

router.post('/signup', async (req, res) => {
    //code to sign up a new user goes
    const body = req.body;

    const User = signupBody.safeParse(body);

    if (User.success) {

        const existingUser = await userModel.findOne({ username: User.data.username });

        if (!existingUser) {
            try {
                const user = await userModel.create({
                    ...User.data,
                    password: await bcrypt.hash(User.data.password, 10),
                });
                const userId = user._id;

                const token = jwt.sign({ userId }, JWT_SECRET)

                res.status(201).json({
                    message: "User create successfully",
                    token: token
                })

            } catch (error) {
                console.log(error);
                res.status(500).send(error)
            }
        } else {
            res.status(411).json({
                message: "User already exists"
            })
        }
    } else {
        res.status(400).send(User.error.format());
    }

});



const loginBody = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(3).trim(),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4,
        { message: "Password must be longer than 4 Characters!" }),
})

router.post('/login', async (req, res) => {
    const body = req.body;

    const User = loginBody.safeParse(body)

    if (User.success) {
        const existingUser = await userModel.findOne({ username: User.data.username })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found! Please check username or signup first." })
        }

        const passCheck = await bcrypt.compare(User.data.password, existingUser.password);

        if (passCheck) {

            // * Need to convert the _id from the findOne() to string before passing it to jwt.sign
            const token = jwt.sign(existingUser._id.toString(), JWT_SECRET);
            return res.status(200).json({ message: "Logged in successfully!", token: token });
        }

        return res.status(401).json({ message: "Incorrect Password. Please retry!" })
    }
    else {
        res.status(400).send(User.error.format());
    }
})

module.exports = router;