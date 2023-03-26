import { VietQR } from "vietqr";
import THQError from "../utils/THQError.Class.js";
import Response from "../utils/Response.Class.js";
import bankModel from "../models/bank.model.js";
import errorHelper from "../helpers/error.helper.js";


let vietqr = new VietQR({
    clientID: '11f4f684-3f8c-4fa8-beb2-1b65a6fa30d4',
    apiKey: '4c148c67-908f-4afb-a279-6d1626c970dc'
})

async function createMyBanks(req, res) {
    try {
        let bank = req.body

        if (!bank) {
            throw THQError("Thiếu trường thông tin")
        }

        await bankModel.findOne({
            bind: req.body.bind,
            accountNumber: req.body.accountNumber,
            accountName: req.body.accountName
        })
        .then( async (response) => {
            if (response) {
                throw THQError("Ngân hàng này đã tồn tại")
            }
            let dbBank = (await bankModel(bank).save()).toJSON();

            if (!dbBank) {
                throw THQError("Thêm ngân hàng thất bại.")
            }

            return res.status(200).send(new Response(
                true,
                "Tao ngan hang thanh cong",
                dbBank
            ))
        })

    } catch (error) {
        errorHelper.sendError(res, createMyBanks, error)
    }
}

async function getMyBanks(req, res) {
    try {
        if (!req.query) {
            throw errorHelper.genError("Thiếu trường thông tin")
        }

        let banks = await bankModel.find({ });

        if (!banks) {
            throw errorHelper.sendError("Lấy thông tin ngân hàng thất bại")
        }

        return res.status(200).send(new Response(
            true,
            "Thanh cong",
            banks
        ))

    } catch(error) {
        errorHelper.sendError(res, getMyBanks, error);
    }
}

async function getBanks(req, res) {
    try {
        if (!req.query) {
            throw THQError("Thiếu trường thông tin")
        }

        await vietqr.getBanks()
        .then((jsonData) => {
            res.status(200).send(new Response(
                true,
                "Thanh cong",
                jsonData.data
            ))
        })
        .catch ((error) => {
            errorHelper.sendError(res, getBanks, error)
        })

    } catch (error) {
        errorHelper.sendError(res, getBanks, error)
    }
}

async function genQRCodeBase64(req, res) {
    try {
        if (!req.body) {
            throw THQError("Thiếu trường thông tin");
        }

        await vietqr.genQRCodeBase64({
            bank: req.body.bank,
            accountName: req.body.accountName,
            accountNumber: req.body.accountNumber,
            amount: req.body.amount,
            memo: req.body.memo,
            template: 'print'
        })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch ((error) => {
            errorHelper.sendError(res, genQRCodeBase64, error)
        })
        
    } catch(error) {
        errorHelper.sendError(res, genQRCodeBase64, error)
    }
}

function genQRCodeQuickLink(req, res) {
    try {
        if (!req.body) {
            throw THQError("Thiếu trường thông tin");
        }

        let link = vietqr.genQuickLink({
            bank: req.body.bank,
            accountName: req.body.accountName,
            accountNumber: req.body.accountNumber,
            amount: req.body.amount,
            memo: req.body.memo,
            template: 'print',
            media: '.jpg',
        })

        res.status(200).send(new Response(
            true,
            "thanh cong",
            {
                "link": link
            }
        )) 
    } catch (error) {
        errorHelper.sendError(res, genQRCodeQuickLink, error)
    }
}


export default {
    createMyBanks,
    getMyBanks,
    getBanks,
    genQRCodeBase64,
    genQRCodeQuickLink
}