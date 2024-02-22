const mongoose = require('mongoose');
// for admin login
const admin_Schema = new mongoose.Schema({
    Email: {
        type: String,
        unique: true,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    }
}, { versionKey: false });

const admin_model = mongoose.model('admin', admin_Schema);

module.exports = admin_model;