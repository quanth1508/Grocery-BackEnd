import authJwt from "../middlewares/authJwt.js";
import { Router } from "express";
import statisticController from "../controllers/statistic.controller.js";


const statisticRoutes = new Router();

statisticRoutes.get(
    "/api/v1/statistic/revenue",
    [authJwt.verifyToken],
    statisticController.getStatisticRevenue
)

export default statisticRoutes