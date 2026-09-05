import { and, eq, isNull, inArray } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  salesOrders,
  salesOrderItems,
  contacts,
  products,
} from "../../../database/schema/index.js";

export class SalesOrderService {
  static async validateCustomer(tx, customerId) {
    const [customer] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, customerId))
      .limit(1);

    if (!customer || customer.archivedAt) {
      const error = new Error("Customer not found");

      error.statusCode = 404;
      error.code = "CUSTOMER_NOT_FOUND";

      throw error;
    }

    if (customer.type !== "customer" && customer.type !== "both") {
      const error = new Error("Contact is not a customer");

      error.statusCode = 400;
      error.code = "INVALID_CUSTOMER";

      throw error;
    }

    return customer;
  }

  static async validateProducts(tx, items) {
    const productIds = [...new Set(items.map((item) => item.productId))];

    const existingProducts = await tx
      .select({
        id: products.id,
      })
      .from(products)
      .where(
        and(inArray(products.id, productIds), isNull(products.archivedAt)),
      );

    const existingProductIds = new Set(
      existingProducts.map((product) => product.id),
    );

    const missingProductId = productIds.find(
      (productId) => !existingProductIds.has(productId),
    );

    if (missingProductId) {
      const error = new Error(`Product not found: ${missingProductId}`);

      error.statusCode = 404;
      error.code = "PRODUCT_NOT_FOUND";

      throw error;
    }
  }

  static async createSalesOrder(data) {
    return await database.transaction(async (tx) => {
      await SalesOrderService.validateCustomer(tx, data.customerId);
      await SalesOrderService.validateProducts(tx, data.items);

      const [salesOrder] = await tx
        .insert(salesOrders)
        .values({
          customerId: data.customerId,
          orderDate: data.orderDate,
          reference: data.reference,
        })
        .returning();

      const items = await tx
        .insert(salesOrderItems)
        .values(
          data.items.map((item) => ({
            salesOrderId: salesOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax,
            total: item.quantity * item.unitPrice + item.tax,
          })),
        )
        .returning();

      return {
        ...salesOrder,
        items,
      };
    });
  }

  static async getSalesOrders() {
    const orders = await database
      .select()
      .from(salesOrders)
      .where(isNull(salesOrders.archivedAt));

    return orders;
  }

  static async getSalesOrderById(id) {
    const [salesOrder] = await database
      .select()
      .from(salesOrders)
      .where(eq(salesOrders.id, id))
      .limit(1);

    if (!salesOrder || salesOrder.archivedAt) {
      const error = new Error("Sales order not found");

      error.statusCode = 404;
      error.code = "SALES_ORDER_NOT_FOUND";

      throw error;
    }

    const items = await database
      .select()
      .from(salesOrderItems)
      .where(eq(salesOrderItems.salesOrderId, id));

    return {
      ...salesOrder,
      items,
    };
  }

  static async updateSalesOrder(id, data) {
    return await database.transaction(async (tx) => {
      const [existingSalesOrder] = await tx
        .select()
        .from(salesOrders)
        .where(eq(salesOrders.id, id))
        .limit(1);

      if (!existingSalesOrder || existingSalesOrder.archivedAt) {
        const error = new Error("Sales order not found");

        error.statusCode = 404;
        error.code = "SALES_ORDER_NOT_FOUND";

        throw error;
      }

      if (data.customerId) {
        await SalesOrderService.validateCustomer(tx, data.customerId);
      }

      if (data.items) {
        await SalesOrderService.validateProducts(tx, data.items);
      }

      const orderUpdate = {};

      if (data.customerId !== undefined) {
        orderUpdate.customerId = data.customerId;
      }

      if (data.orderDate !== undefined) {
        orderUpdate.orderDate = data.orderDate;
      }

      if (data.reference !== undefined) {
        orderUpdate.reference = data.reference;
      }

      let updatedSalesOrder = existingSalesOrder;

      if (Object.keys(orderUpdate).length > 0) {
        const [result] = await tx
          .update(salesOrders)
          .set(orderUpdate)
          .where(eq(salesOrders.id, id))
          .returning();

        updatedSalesOrder = result;
      }

      let items;

      if (data.items) {
        await tx
          .delete(salesOrderItems)
          .where(eq(salesOrderItems.salesOrderId, id));

        items = await tx
          .insert(salesOrderItems)
          .values(
            data.items.map((item) => ({
              salesOrderId: id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: item.tax,
              total: item.quantity * item.unitPrice + item.tax,
            })),
          )
          .returning();
      } else {
        items = await tx
          .select()
          .from(salesOrderItems)
          .where(eq(salesOrderItems.salesOrderId, id));
      }

      return {
        ...updatedSalesOrder,
        items,
      };
    });
  }

  static async archiveSalesOrder(id) {
    const [salesOrder] = await database
      .update(salesOrders)
      .set({
        archivedAt: new Date(),
      })
      .where(and(eq(salesOrders.id, id), isNull(salesOrders.archivedAt)))
      .returning();

    if (!salesOrder) {
      const error = new Error("Sales order not found");

      error.statusCode = 404;
      error.code = "SALES_ORDER_NOT_FOUND";

      throw error;
    }

    return salesOrder;
  }
}

export default SalesOrderService;
