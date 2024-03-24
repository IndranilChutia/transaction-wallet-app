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
    firstName: String,
    lastName: String,
});

const userModel = mongoose.model('User', userSchema)

module.exports = { userModel };
