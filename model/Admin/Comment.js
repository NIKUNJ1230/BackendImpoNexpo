const mongoose = require('mongoose');
// for admin login
const Message_Schema = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Message: {
        type: String,
        required: true,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });
const Message_model = mongoose.model('comment', Message_Schema);

module.exports = Message_model;