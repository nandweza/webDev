const mongoose = require('mongoose');

const userSChema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true }
    }
);

module.exports = mongoose.model('User', userSChema);