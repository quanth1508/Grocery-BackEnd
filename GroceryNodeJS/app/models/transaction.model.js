'use strict'
import mongoose from "mongoose"

const TransactionSchema = new mongoose.Schema({
    id: String,
    products: { type: Array, default: [] },
    quantities: { type: Array, default: [] },
    initialCapital: Number,
    paymentMoney: Number,
    discountMoney: Number,
    paymentType: Number,
    user_id: String
}, {
    collection: "Transaction",
    timestamps: true
})

export default mongoose.model("transaction", TransactionSchema, "transaction")