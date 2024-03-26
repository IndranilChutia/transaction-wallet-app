const express = require('express');
const { z } = require('zod');
const { userModel, Account } = require('../db');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const authMiddleware = require('../middleware')

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT = 10;


// Signup Body Validation
const signupBody = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(3).trim().toLowerCase(),
    firstName: z.string().toLowerCase(),
    lastName: z.string().toLowerCase(),
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
                    password: await bcrypt.hash(User.data.password, SALT),

                });
                const userId = user._id;

                await Account.create({
                    userId,
                    balance: 1 + Math.random() * 10000
                })

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
            res.status(400).json({
                message: "User already exists"
            })
        }
    } else {
        res.status(400).send(User.error.format());
    }

});


// Login Body Validation
const loginBody = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(3).trim().toLowerCase(),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4,
        { message: "Password must be longer than 4 Characters!" }),
})

router.post('/signin', async (req, res) => {
    const body = req.body;
    // console.log(req)
    const User = loginBody.safeParse(body)

    if (User.success) {
        const existingUser = await userModel.findOne({ username: User.data.username })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found! Please check username or signup first." })
        }

        const passCheck = await bcrypt.compare(User.data.password, existingUser.password);

        if (passCheck) {

            // * Need to convert the _id from the findOne() to string before passing it to jwt.sign
            const userId = existingUser._id;
            const token = jwt.sign({ userId }, JWT_SECRET);
            return res.status(200).json({ message: "Logged in successfully!", token: token });
        }

        return res.status(401).json({ message: "Incorrect Password. Please retry!" })
    }
    else {
        res.status(400).send(User.error.format());
    }
})


// Update User Body Validation
const updateUserBody = z.object({
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(3).trim(),
    firstName: z.string(),
    lastName: z.string(),
}).partial();

router.put('/updateUser', authMiddleware, async (req, res) => {
    try {
        const User = updateUserBody.safeParse(req.body)
        if (!User.success) {
            return res.status(411).send(User.error.format());
        }

        // If password is provided in body hash it
        if (User.data.password) {
            // Hash the password
            User.data.password = await bcrypt.hash(User.data.password, SALT);
        }

        const updatedUser = await userModel.updateOne({ _id: req.userId }, User.data)

        console.log(updatedUser)
        res.status(200).json({ message: 'Successfully Updated!' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
})




router.get('/bulk', async (req, res) => {
    try {
        // Query Schema
        const querySchema = z.string({
            required_error: "Query parameter missing from request URL.",
            invalid_type_error: "Query must be a string"
        }).trim().toLowerCase();

        // Validate Schema
        const query = querySchema.safeParse(req.query.filter);

        if (!query.success) {
            return res.status(400).send(query.error.format());
        }

        console.log(query.data)

        const filter = new RegExp("^" + query.data, "i");
        let users = await userModel.find({
            $or: [
                { firstName: { $regex: filter } },
                { lastName: { $regex: filter } }
            ]
        })

        console.log(users)

        res.status(200).json({
            users: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id.toString()
            }))
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})


module.exports = router;