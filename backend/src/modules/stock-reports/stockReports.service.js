import { eq, sql } from "drizzle-orm";

import { database } from "../../../database/index.js";

import { products, stockMovements } from "../../../database/schema/index.js";

export class StockReportsService {
  static async getStockReport() {
    const report = await database
      .select({
        productId: products.id,
        productName: products.productName,

        quantityIn: sql`
          COALESCE(
            SUM(
              CASE
                WHEN ${stockMovements.movementType} = 'in'
                  THEN ${stockMovements.quantity}
                ELSE 0
              END
            ),
            0
          )
        `,

        quantityOut: sql`
          COALESCE(
            SUM(
              CASE
                WHEN ${stockMovements.movementType} = 'out'
                  THEN ${stockMovements.quantity}
                ELSE 0
              END
            ),
            0
          )
        `,

        currentStock: sql`
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
      .from(products)
      .leftJoin(stockMovements, eq(products.id, stockMovements.productId))
      .where(sql`${products.archivedAt} IS NULL`)
      .groupBy(products.id, products.productName);

    return report.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantityIn: Number(item.quantityIn),
      quantityOut: Number(item.quantityOut),
      currentStock: Number(item.currentStock),
    }));
  }

  static async getProductStockReport(productId) {
    const [product] = await database
      .select({
        id: products.id,
        productName: products.productName,
      })
      .from(products)
      .where(
        sql`
          ${products.id} = ${productId}
          AND ${products.archivedAt} IS NULL
        `,
      )
      .limit(1);

    if (!product) {
      const error = new Error("Product not found");

      error.statusCode = 404;
      error.code = "PRODUCT_NOT_FOUND";

      throw error;
    }

    const [stock] = await database
      .select({
        quantityIn: sql`
          COALESCE(
            SUM(
              CASE
                WHEN ${stockMovements.movementType} = 'in'
                  THEN ${stockMovements.quantity}
                ELSE 0
              END
            ),
            0
          )
        `,

        quantityOut: sql`
          COALESCE(
            SUM(
              CASE
                WHEN ${stockMovements.movementType} = 'out'
                  THEN ${stockMovements.quantity}
                ELSE 0
              END
            ),
            0
          )
        `,

        currentStock: sql`
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

    return {
      productId: product.id,
      productName: product.productName,
      quantityIn: Number(stock.quantityIn),
      quantityOut: Number(stock.quantityOut),
      currentStock: Number(stock.currentStock),
    };
  }
}

export default StockReportsService;
