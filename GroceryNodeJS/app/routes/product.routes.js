import { authJwt } from "../middlewares";
import { controller } from "../controllers/product.controller";

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    app.get(
        "/api/v1/product/list", 
        [authJwt.verifyToken],
        controller.getListProduct
    );

    app.post(
        "/api/v1/product/create",
        [authJwt.verifyToken],
        controller.createProduct
    )
}