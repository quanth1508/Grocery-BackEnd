import Response from "../utils/Response.Class.js";
import THQError from "../utils/THQError.Class.js";
import transactionModel from "../models/transaction.model.js";
import errorHelper from "../helpers/error.helper.js";

async function getHistoryTransaction(req, res) {
    try {
        if (!req.query) {
            throw THQError("Không có dữ liệu truyền lên")
        }

        let transactions = await transactionModel.find( { })

        res.status(200).send(new Response(
            true,
            "Thanh cong",
            transactions
        ))

    } catch (error) {
        errorHelper.sendError(res, getHistoryTransaction, error)
    }
}

export default {
    getHistoryTransaction
}
