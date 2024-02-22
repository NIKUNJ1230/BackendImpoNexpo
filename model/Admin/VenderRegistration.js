const mongoose = require('mongoose');
// for admin login
const venderRegistration_Schema = new mongoose.Schema({
    Manager:{
        type:Number,
    },
    BusinessName: {
        type: String,
        required: true,
    },
    Website: {
        type: String,
        required: true,
    },
  
    Mobile: {
        type: Number,
        unique: true,
        required: true,
    },
    EntityType: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        unique: true,
        required: true,
    },
    Country: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    ProductName: {
        type: String,
        required: true,
    },
    ProductCategory: {
        type: String,
        required: true,
    },
    ProductDescription: {
        type: String
    },
    ProfileImage: {
        type: String,
    },
    AffiliatePartner: {
        type: Boolean,
    },
    Followers: {
        type: Number,
        default: 0
    },
    Views: {
        type: Number,
        default: 0
    },
    SellersCapacity: {
        type: Array,
    },
    Summary: {
        type: Array,
    },
    Password: {
        type: String,
        required: true,
    }
}, { versionKey: false });
const vender_model = mongoose.model('vender', venderRegistration_Schema);

module.exports = vender_model;