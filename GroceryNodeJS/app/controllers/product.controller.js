import config from "../config/auth.config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
const ROLES  = ["user", "admin", "moderator"];
import Product from "../models/product.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import Response from "../utils/Response.Class.js";
import THQError from "../utils/THQError.Class.js";
import { v4 as uuidv4 } from 'uuid'

async function createProduct(req, res) {
        try {
            if (!req.body) {
                throw THQError("Thiếu trường thông tin!")
            }

            await Product.findOne(
                {
                    barCode: req.body.barCode
                }
            )
            .then(async response => {
                if (response) {
                    throw THQError("Mã vạch sản phẩm đã tồn tại vui lòng tìm kiếm kiểm tra và chỉnh sửa")
                }

                var day = new dayjs(req.body.hsd);
                const product = new Product({
                    id: uuidv4(),
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
                        });
                        return;
                    }

                    res.status(200).send({
                        success: true,
                        message: "Tạo sản phẩm thành công"
                    });
                })
            })
            .catch( error => {
                if (error instanceof THQError) {
                    res.send(new Response(
                        false,
                        error.message,
                        null
                    ))
                    return
                }

                res.send(new Response(
                    false,
                    "Mã vạch sản phẩm đã tồn tại vui lòng tìm kiếm kiểm tra và chỉnh sửa",
                    null
                ))
            })
        } catch {
            res.send(Response.defaultFailure)
        }
};

async function getListProduct(req, res) {
    let findAll = await Product.find({ });
    res.status(200).send({
        success: true,
        data: findAll
    })
};

async function getListProductSearch(req, res) {
    try {
        let keyword = req.query.keyword || ""
        
        let resultName = await Product.find({
            "name": {
                $regex: new RegExp(`.*${keyword}.*`, "i")
            }
        })

        let resultBarcode = await Product.find({
            "barCode": {
                $regex: new RegExp(`.*${keyword}.*`, "i")
            }
        })

        var items = [...new Set(resultName.concat(resultBarcode))]
        const keys = ['id', 'barCode']
        const filteredData = items.filter((value, index, self) => 
            self.findIndex(v => keys.every(k => v[k] === value[k])) === index
        );

        res.status(200).send(new Response(
            true,
            "Thành công",
            filteredData
        ))

    } catch {
        res.send(Response.defaultFailure)
    }
}

async function deleteProduct(req, res) {
    try {
        if (!req.body) {
            throw THQError("Thiếu trường thông tin!")
        }

        let id = req.body.id
        await Product.findOneAndRemove({ 
            "id": id
         })

         res.status(200).send(new Response(
            true,
            "Thành công",
            null
         ))

    } catch {
        res.send(Response.defaultFailure)
    }
}

async function updateProduct(req, res) {
    try {
        if (!req.body) {
            throw THQError("Thiếu trường thông tin!")
        }

        let product = req.body

        let updatedProduct = await Product.findOneAndUpdate(
            {
                id: product.id
            },
            product,
            {
                upsert: true,
                new: true
            }
        )

        if (!updatedProduct) {
            throw THQError("Cập nhật sản phẩm thất bại, vui lòng thử lại sau!")
        }

        res.status(200).send(new Response(
            true,
            "Thành công",
            updatedProduct
        ))

    } catch {
        res.send(Response.defaultFailure)
    }
}

async function findProduct(req, res) {
    try {
        if (!req.query) {
            throw THQError.defaultFailure
        }

        let product = await Product.findOne(
            {
                barCode: req.query.barCode
            }
        )

        if (!product) {
            res.send(new Response(
                false,
                "Sản phẩm chưa được thêm vào kho, vui lòng thêm vào kho hàng",
                null
            ))
        }

        res.status(200).send(new Response(
            true,
            "Thanh cong",
            product
        ))

    } catch {
        res.send(Response.defaultFailure)
    }
}


export default {
    createProduct,
    getListProduct,
    getListProductSearch,
    deleteProduct,
    updateProduct,
    findProduct
}