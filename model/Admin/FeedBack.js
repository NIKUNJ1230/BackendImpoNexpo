const mongoose = require('mongoose');
// for admin login
const FeedBack_Schema = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    FeedBack: {
        type: String,
        required: true,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });
const FeedBack_model = mongoose.model('feedBack', FeedBack_Schema);

module.exports = FeedBack_model;