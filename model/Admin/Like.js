const mongoose = require('mongoose');
// for admin login
const Like_Schema = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const Like_model = mongoose.model('like', Like_Schema);
module.exports = Like_model;