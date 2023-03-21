import config from "../config/auth.config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
const ROLES  = ["user", "admin", "moderator"];
import Product from "../models/product.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

async function createProduct(req, res) {
    console.log(req.body.hsd);
    var day = new dayjs(req.body.hsd);
    const product = new Product({
        images: req.body.images,
        barCode: req.body.barCode,
        name: req.body.name,
        quantity: req.body.quantity,
        weight: req.body.weight,
        inputPrice: req.body.inputPrice,
        outputPrice: req.body.outputPrice,
        hsd: day,
        desc: req.body.desc
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
};

async function getListProduct(req, res) {
    let findAll = await Product.find({ });
    console.log(findAll);
    res.status(200).send({
        success: true,
        data: findAll
    })
};

export default {
    createProduct,
    getListProduct
}