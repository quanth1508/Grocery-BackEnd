import authJwt from "../middlewares/authJwt.js";
import { Router } from "express";
import statisticController from "../controllers/statistic.controller.js";


const statisticRoutes = new Router();

statisticRoutes.get(
    "/api/v1/statistic/revenue",
    [authJwt.verifyToken],
    statisticController.getStatisticRevenue
)

statisticRoutes.get(
    "/api/v1/statistic/capitalAndRevenue",
    [authJwt.verifyToken],
    statisticController.getCapitalAndRevenue
)

statisticRoutes.get(
    "/api/v1/statistic/numberOfTransaction",
    [authJwt.verifyToken],
    statisticController.getNumberOfTransaction
)


export default statisticRoutes