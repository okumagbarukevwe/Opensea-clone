const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    wallet: String,
    email: String,
    keyPhrase: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', userSchema);