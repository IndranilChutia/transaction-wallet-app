const express = require('express');
const authMiddleware = require('../middleware');
const mongoose = require('mongoose');
const { z } = require('zod')
const { Account } = require('../db');

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;
const SALT = 10;

/**
 * @route GET api/v1/account/balance
 * * Get user balance by userId
 * The userId is retrieved from the token in header of request
 */
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const user = await Account.findOne({ userId: req.userId }).select('balance')
        console.log(user)
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: 'Error getting balance'
        })
    }
})


/** 
 * @route POST /api/v1/account/transfer
 * @body to: string, amount: number
 * 
 * * Transfer Money to userId
 * 
 * Deducts the amount from the user's account balance and
 * adds it to the reciever's account balance
 */

const transferSchema = z.object({
    to: z.string({
        required_error: "Reciever is required",
        invalid_type_error: "Reciever must be a string",
    }).min(12).trim(),
    amount: z.number().positive("Amount should be positive")
})
router.post('/transfer', authMiddleware, async (req, res) => {
    // Starting a session
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Parse body
        const transferBody = transferSchema.safeParse(req.body);
        if (!transferBody.success) {
            await session.abortTransaction();
            return res.status(400).send(transferBody.error.format())
        }

        // Check if sending money to self
        if (req.userId === transferBody.data.to) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Cannot transfer money to self!" })
        }

        // Check if receiver exists
        const receiver = await Account.findOne({ userId: transferBody.data.to }).session(session);
        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Receiver not found" });
        }

        // Find sender account
        const sender = await Account.findOne({ userId: req.userId }).session(session);
        if (!sender) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Sender not found" });
        }

        // Check if sender has sufficient balance
        if (transferBody.data.amount > sender.balance) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient Balance" })
        }

        try {
            // Update sender's balance
            await Account.updateOne(
                { userId: req.userId },
                { $inc: { balance: -transferBody.data.amount } }
            ).session(session);

            // Update receiver's balance
            await Account.updateOne(
                { userId: transferBody.data.to },
                { $inc: { balance: transferBody.data.amount } }
            ).session(session);

            await session.commitTransaction();
            return res.status(200).json({ message: "Transaction Successful!" });
        } catch (err) {
            await session.abortTransaction();
            console.log("Error updating balances:", error);
            return res.status(500).json({ message: "Transaction Failed" });
        }

    } catch (error) {
        console.log("Error in transfer route:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
});




module.exports = router