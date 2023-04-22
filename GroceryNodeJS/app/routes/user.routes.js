import authJwt from "../middlewares/authJwt.js";
import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRoutes = Router()

userRoutes.get(
    "/api/v1/shop/info",
    [authJwt.verifyToken],
    userController.getShopInfo
)

userRoutes.post(
    "/api/v1/shop/update",
    [authJwt.verifyToken],
    userController.updateShopInfo
)

export default userRoutes