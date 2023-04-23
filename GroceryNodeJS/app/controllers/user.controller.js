import THQError from "../utils/THQError.Class.js";
import Response from "../utils/Response.Class.js";
import errorHelper from "../helpers/error.helper.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid'
import jsonwebtoken from 'jsonwebtoken';
import secret from "../config/auth.config.js";
import userIdFromReq from "../helpers/user.helper.js";


async function getShopInfo(req, res) {
    try {
        if (!req.query) {
            throw THQError("Không tìm thấy thông tin shop!")
        }
        let user_id = userIdFromReq(req)
        console.log(`test: ${user_id}`)

        let shop = await User.findOne( {
            user_id: user_id
        })
        console.log(shop)
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
    let user_id = userIdFromReq(req)

    let shop = await User.findOneAndUpdate(
        {
            user_id: user_id
        }, 
        req.body,
        {
            upsert: false,
            new: false
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