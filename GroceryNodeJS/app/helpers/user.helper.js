'use strict'
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import secret from "../config/auth.config.js"

function userIdFromReq(req) {
    var bearerToken = req.headers['authorization'] || req.headers['x-access-token'];
    const token = String(bearerToken).split(' ')[1];        
    if (!token) { return null }
    let { user_id } = jwt.verify(token, secret)
    return user_id
}

export default userIdFromReq