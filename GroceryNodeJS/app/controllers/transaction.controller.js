import Response from "../utils/Response.Class.js";
import THQError from "../utils/THQError.Class.js";
import transactionModel from "../models/transaction.model.js";
import errorHelper from "../helpers/error.helper.js";
import userIdFromReq from "../helpers/user.helper.js";


async function getHistoryTransaction(req, res) {
    try {
        if (!req.query) {
            throw THQError("Không có dữ liệu truyền lên")
        }
        let user_id = await userIdFromReq(req)

        let objFilter = {
            user_id: user_id
        }
        let objSort = {
            createdAt: -1
        }
        let transactions = await transactionModel
            .find(objFilter)
            .sort(objSort)

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
