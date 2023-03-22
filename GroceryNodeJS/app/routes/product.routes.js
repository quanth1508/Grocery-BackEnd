import authJwt  from "../middlewares/authJwt.js";
import productController from "../controllers/product.controller.js";

import { Router } from "express";

const productRouter = new Router();

productRouter.get(
  "/api/v1/product/list", 
  [authJwt.verifyToken],
  productController.getListProduct
);

productRouter.post(
  "/api/v1/product/create",
  [authJwt.verifyToken],
  productController.createProduct
);

productRouter.get(
  "/api/v1/product/search",
  [authJwt.verifyToken],
  productController.getListProductSearch
)

productRouter.post(
  "/api/v1/product/delete",
  [authJwt.verifyToken],
  productController.deleteProduct
)

productRouter.post(
  "/api/v1/product/update",
  [authJwt.verifyToken],
  productController.updateProduct
)

export default productRouter;