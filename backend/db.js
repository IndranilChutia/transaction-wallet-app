const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
});


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
        required: true,
    }
})

const userModel = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', accountSchema)


module.exports = { userModel, Account };
