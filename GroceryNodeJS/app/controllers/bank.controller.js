import { VietQR } from "vietqr";
import THQError from "../utils/THQError.Class.js";
import Response from "../utils/Response.Class.js";
import bankModel from "../models/bank.model.js";
import errorHelper from "../helpers/error.helper.js";
import productController from "./product.controller.js";
import productModel from "../models/product.model.js";
import transactionModel from "../models/transaction.model.js";
import { v4 as uuidv4 } from 'uuid'

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
            template: req.body.template,
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

async function payment(req, res) {
    try {
        if (!req.body) {
            throw THQError("Thiếu trường thông tin");
        }

        let productsShort = Array.isArray(req.body.products) ? req.body.products : [] 

        if (productsShort.length == 0) {
            throw THQError("Chưa có sản phẩm để thanh toán!");
        }

        var _products = []
        var quantitiesPayment = []
        for (let i = 0; i < productsShort.length; i++) {
            let id = productsShort[i].id
            let productInDB  = await productModel.findOne( { id: id })

            if ((productInDB.sold + productsShort[i].quantity) > productInDB.quantity) {
                throw errorHelper.genError(` Cửa hàng của bạn còn ${productInDB.quantity - productInDB.sold} SP ${productInDB.name} sẵn sàng để thanh toán. Vui lòng chọn lại số lượng phù hợp.`)
            }
            productInDB.sold += productsShort[i].quantity
            _products[i] = productInDB
            quantitiesPayment[i] = productsShort[i].quantity

            let updatedProduct = await productModel.findOneAndUpdate(
                {
                    id: id
                },
                productInDB,
                {
                    upsert: true,
                    new: true
                }
            )

            if (!updatedProduct) {
                throw THQError("Cập nhật sản phẩm thất bại, vui lòng thử lại sau!")
            }
        }

        let newTransaction = {
            id: uuidv4(),
            products: _products,
            quantities: quantitiesPayment,
            paymentMoney: req.body.paymentMoney,
            discountMoney: req.body.discountMoney
        }

        let dbTransaction = (await transactionModel(newTransaction).save()).toJSON()

        if (!dbTransaction) {
            throw THQError("Thanh toán thành công nhưng tạo giao dịch thất bại!")
        }
        
        res.status(200).send(new Response(
            true,
            "Thành công",
            dbTransaction
        ))

    } catch (error) {
        errorHelper.sendError(res, payment, error)
    }
}


export default {
    createMyBanks,
    getMyBanks,
    getBanks,
    genQRCodeBase64,
    genQRCodeQuickLink,
    payment
}