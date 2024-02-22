const mongoose = require('mongoose');
// for admin login
const Reviews_Schema = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Reviews: {
        type: String,
        required: true,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });
const Reviews_model = mongoose.model('Reviews', Reviews_Schema);

module.exports = Reviews_model;