import transactionController from "../controllers/transaction.controller.js";
import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";

const transactionRoutes = new Router();

transactionRoutes.get(
    "/api/v1/payment/transaction/list",
    authJwt.verifyToken,
    transactionController.getHistoryTransaction
)

export default transactionRoutes