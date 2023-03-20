const mongoose = require("mongoose");

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        images: [String],
        barCode: String,
        name: String,
        quantity: Int,
        weight: Double,
        inputPrice: Double,
        outputPrice: Double,
        hsd: Date,
        desc: String,
        createTime: Date = Date()
    })
);

module.exports = Product;