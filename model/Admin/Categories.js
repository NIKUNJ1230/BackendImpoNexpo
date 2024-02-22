const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { versionKey: false });

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subcategories: [subcategorySchema]
}, { versionKey: false });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

// const mongoose = require('mongoose');
// // for admin login
// const AddCategories_Schema = new mongoose.Schema({
//     Category: {
//         type: String,
//         required: true
//     }
// }, { versionKey: false });
// const AddCategories_model = mongoose.model('categorie', AddCategories_Schema);

// module.exports = AddCategories_model;