import THQError from "../utils/THQError.Class.js";
import Response from "../utils/Response.Class.js";
import errorHelper from "../helpers/error.helper.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid'
import jsonwebtoken from 'jsonwebtoken';
import secret from "../config/auth.config.js";


async function getShopInfo(req, res) {
    try {

        if (!req.query) {
            throw THQError("Không tìm thấy thông tin shop!")
        }

        let shop = await User.findOne( {
            phone: req.query.phone
        })
        res.status(200).send(new Response(
            true,
            "thanh cong",
            shop
        ))
    } catch (error) {
        errorHelper.sendError(res, getShopInfo, error)
    }
}

async function updateShopInfo(req, res) {
   try {
    if (!req.body) {
        return THQError("Khong co du lieu")
    }

    let shop = await User.findOneAndUpdate(
        {
            phone: req.body.phone
        }, 
        req.body,
        {
            upsert: true,
            new: true
        }
    )

    return res.status(200).send(new Response(
        true,
        "Thanh cong",
        shop
    ))

    } catch (error) {
        errorHelper.sendError(res, getShopInfo, error)
    }
}

export default {
    getShopInfo,
    updateShopInfo
}