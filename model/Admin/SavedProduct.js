const mongoose = require('mongoose');
// for admin login
const SavedProduct_Schema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signup'
    },
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });
const SavedProduct_model = mongoose.model('Saved_product', SavedProduct_Schema);

module.exports = SavedProduct_model;