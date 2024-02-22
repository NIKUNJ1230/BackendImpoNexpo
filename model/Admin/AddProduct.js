const mongoose = require('mongoose');

// Define schema for dynamic key-value pairs
const dynamicKeyValueSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

const productPricingSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    minQty: {
        type: Number
    },
    maxQty: {
        type: Number
    }
});
// for admin login
const AddProduct_Schema = new mongoose.Schema({
    VenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender'
    },
    ProductImage: {
        type: Array,
    },
    Like: {
        type: Number,
        default: 0,
    },
    Comment: {
        type: Number,
        default: 0,
    },
    Share: {
        type: Number,
        default: 0,
    },
    Saved: {
        type: Number,
        default: 0,
    },
    Views: {
        type: Number,
        default: 0,
    },
    Sold: {
        type: Number,
        default: 0,
    },
    ProductName: {
        type: String,
        required: true,
    },
    HashTags: {
        type: Array
    },
    ProductDescription: {
        type: String
    },
    DescriptionPrice: {
        type: String
    },

    PriceRange: [productPricingSchema], // Embedding pricing information
    DynamicDetails: [dynamicKeyValueSchema] ,
    Discount:{
        type: Number,
        default: 0,
    },
    StartPrice: {
        type: Number,
    },
    EndPrice: {
        type: Number,
    },
    MinOrder: {
        type: Number,
    },
    Stock: {
        type: Number,
    },
    Category: {
        type: String,
    },
    SubCategory: {
        type: String,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });
const vender_model = mongoose.model('Product', AddProduct_Schema);

module.exports = vender_model;