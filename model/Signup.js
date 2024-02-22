const mongoose = require('mongoose');

// for admin login
const signUp_Schema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String
    },
    Email: {
        type: String,
        unique: true,
        required: true,
    },
    Mobile: {
        type: Number,
        unique: true,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    AccountType: {
        type: String,
        required: true
    },
    CompanyName: {
        type: String
    },
    Country: {
        type: String,
        required: true
    },
    ReasionForSignUp: {
        type: String,
        required: true
    },
    Site: {
        type: String
    },
    TnC: {
        type: Boolean
    }
}, { versionKey: false });

const signUp_model = mongoose.model('signup', signUp_Schema);

module.exports = signUp_model;