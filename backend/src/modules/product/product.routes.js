import { Router } from "express";

import { ProductController } from "./product.controller.js";

const productRoute = Router();

productRoute.post("/", ProductController.createProduct);
productRoute.get("/", ProductController.getProducts);
productRoute.get("/:id", ProductController.getProductById);
productRoute.patch("/:id", ProductController.updateProduct);
productRoute.patch("/:id/archive", ProductController.archiveProduct);

export default productRoute;
