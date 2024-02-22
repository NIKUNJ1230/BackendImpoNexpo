const mongoose = require('mongoose');
// for admin login
const aboutus_Schema = new mongoose.Schema({
    Profile: {
        type: String,
        required: true,
    },
    Rank: {
        type: Number,
        required: true,
    },
    Name: {
        type: String,
    },
    Descreption: {
        type: String,
        required: true,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false });

const aboutus_model = mongoose.model('aboutus', aboutus_Schema);

module.exports = aboutus_model;