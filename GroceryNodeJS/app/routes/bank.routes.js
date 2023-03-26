import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import vietqrController from "../controllers/bank.controller.js";

let bankRoutes = new Router();

bankRoutes.post(
    "/api/v1/payment/createMyBanks",
    [authJwt.verifyToken],
    vietqrController.createMyBanks
)

bankRoutes.get(
    "/api/v1/payment/getMyBanks",
    [authJwt.verifyToken],
    vietqrController.getMyBanks
)

bankRoutes.get(
    "/api/v1/payment/getBanks",
    [authJwt.verifyToken],
    vietqrController.getBanks
)

bankRoutes.post(
    "/api/v1/payment/genQRCodeBase64",
    [authJwt.verifyToken],
    vietqrController.genQRCodeBase64
)

bankRoutes.post(
    "/api/v1/payment/genQRCodeQuickLink",
    [authJwt.verifyToken],
    vietqrController.genQRCodeQuickLink
)

export default bankRoutes