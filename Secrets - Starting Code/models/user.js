require('dotenv').config();
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');

const userSChema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true }
    }
);

// userSChema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

module.exports = mongoose.model('User', userSChema);