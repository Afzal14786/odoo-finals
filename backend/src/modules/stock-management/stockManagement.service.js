import { and, eq, isNull, sql } from "drizzle-orm";

import { database } from "../../../database/index.js";

import { stockMovements, products } from "../../../database/schema/index.js";

export class StockManagementService {
  static async validateProduct(tx, productId) {
    const [product] = await tx
      .select()
      .from(products)
      .where(and(eq(products.id, productId), isNull(products.archivedAt)))
      .limit(1);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      error.code = "PRODUCT_NOT_FOUND";
      throw error;
    }

    return product;
  }

  static async getProductStock(productId, tx = database) {
    const [result] = await tx
      .select({
        stock: sql`
          COALESCE(
            SUM(
              CASE
                WHEN ${stockMovements.movementType} = 'in'
                  THEN ${stockMovements.quantity}
                WHEN ${stockMovements.movementType} = 'out'
                  THEN -${stockMovements.quantity}
                ELSE 0
              END
            ),
            0
          )
        `,
      })
      .from(stockMovements)
      .where(eq(stockMovements.productId, productId));

    return Number(result?.stock ?? 0);
  }

  static async createStockMovement(data) {
    return await database.transaction(async (tx) => {
      await StockManagementService.validateProduct(tx, data.productId);

      const currentStock = await StockManagementService.getProductStock(
        data.productId,
        tx,
      );

      if (data.movementType === "out" && data.quantity > currentStock) {
        const error = new Error(
          `Insufficient stock. Available stock is ${currentStock}`,
        );

        error.statusCode = 400;
        error.code = "INSUFFICIENT_STOCK";

        throw error;
      }

      const [stockMovement] = await tx
        .insert(stockMovements)
        .values({
          productId: data.productId,
          movementType: data.movementType,
          quantity: data.quantity,
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          movementDate: data.movementDate,
          reference: data.reference,
        })
        .returning();

      const updatedStock =
        data.movementType === "in"
          ? currentStock + data.quantity
          : currentStock - data.quantity;

      return {
        ...stockMovement,
        currentStock: updatedStock,
      };
    });
  }

  static async getStockMovements() {
    return await database.select().from(stockMovements);
  }

  static async getStockMovementById(id) {
    const [stockMovement] = await database
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.id, id))
      .limit(1);

    if (!stockMovement) {
      const error = new Error("Stock movement not found");

      error.statusCode = 404;
      error.code = "STOCK_MOVEMENT_NOT_FOUND";

      throw error;
    }

    return stockMovement;
  }

  static async getProductStockDetails(productId) {
    await StockManagementService.validateProduct(database, productId);

    const currentStock =
      await StockManagementService.getProductStock(productId);

    const movements = await database
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.productId, productId));

    return {
      productId,
      currentStock,
      movements,
    };
  }
}

export default StockManagementService;
