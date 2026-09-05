import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "./product.validation.js";

import { ProductService } from "./product.service.js";

export class ProductController {
  static async createProduct(req, res, next) {
    try {
      const validatedData = createProductSchema.parse(req.body);

      const product = await ProductService.createProduct(validatedData);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
          product,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req, res, next) {
    try {
      const products = await ProductService.getProducts();

      return res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: {
          products,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = productIdSchema.parse(req.params);

      const product = await ProductService.getProductById(id);

      return res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        data: {
          product,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { id } = productIdSchema.parse(req.params);

      const validatedData = updateProductSchema.parse(req.body);

      const product = await ProductService.updateProduct(id, validatedData);

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: {
          product,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveProduct(req, res, next) {
    try {
      const { id } = productIdSchema.parse(req.params);

      const product = await ProductService.archiveProduct(id);

      return res.status(200).json({
        success: true,
        message: "Product archived successfully",
        data: {
          product,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
