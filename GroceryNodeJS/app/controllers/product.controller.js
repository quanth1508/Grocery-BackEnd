const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Product = db.product
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { verifyToken } from "../middlewares/authJwt";

async function createProduct(req, res) {
    const product = new Product({
        images: req.images,
        barCode: req.barCode,
        name: req.name,
        quantity: req.quantity,
        weight: req.weight,
        inputPrice: req.inputPrice,
        outputPrice: req.outputPrice,
        hsd: req.hsd,
        desc: req.desc
    })

    product.save((error, product) => {
        if (error) {
            res.status(500).send({
                success: false,
                message: error
            })
            return;
        }

        res.status(200).send({
            success: true,
            message: "Tạo sản phẩm thành công"
        })
    })
}

async function getListProduct(req, res) {
    let result = Product
        .find()
        .sort({ createTime: -1 })

    res.status(200).send({
        success: true,
        data: result
    })
}

export {
    createProduct,
    getListProduct
}