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

statisticRoutes.get(
    "/api/v1/statistic/top-seller",
    [authJwt.verifyToken],
    statisticController.getTopSeller
)

statisticRoutes.get(
    "/api/v1/statistic/top-expired",
    [authJwt.verifyToken],
    statisticController.getTopExpired
)


export default statisticRoutes