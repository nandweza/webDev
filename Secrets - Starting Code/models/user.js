require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
// const encrypt = require('mongoose-encryption');

const userSChema = new mongoose.Schema(
    {
        username: String,
        password: String
    }
);

userSChema.plugin(passportLocalMongoose);
userSChema.plugin(findOrCreate);
// userSChema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

module.exports = mongoose.model('User', userSChema);