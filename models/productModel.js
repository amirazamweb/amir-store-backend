const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:String,
    brandName:String,
    category:String,
    productImage:[],
    price:Number,
    sellingPrice:Number,
    description:String
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('Product', productSchema);