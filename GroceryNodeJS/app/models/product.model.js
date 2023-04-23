'use strict'
import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({
    id: String,
    images: [String],
    barCode: String,
    name: String,
    quantity: Number,
    weight: Number,
    inputPrice: Number,
    outputPrice: Number,
    hsd: Date,
    desc: String,
    sold: Number,
    expiredMilliseconds: Number,
    hsdType: Number,
    hsdDay: Number,
    hsdWeek: Number,
    hsdMonth: Number,
    user_id: String
}, {
    collection: 'Product',
    timestamps: true
})

export default mongoose.model("Product", OrderSchema, "Product")