import { eq, isNull, inArray } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  purchaseOrders,
  purchaseOrderItems,
  contacts,
  products,
} from "../../../database/schema/index.js";

export class PurchaseOrderService {
  /**
   * Validate that the vendor exists,
   * is not archived, and has a valid
   * vendor type.
   */
  static async validateVendor(vendorId) {
    const [vendor] = await database
      .select({
        id: contacts.id,
        type: contacts.type,
        archivedAt: contacts.archivedAt,
      })
      .from(contacts)
      .where(eq(contacts.id, vendorId))
      .limit(1);

    if (!vendor) {
      const error = new Error("Vendor not found");

      error.statusCode = 404;
      error.code = "VENDOR_NOT_FOUND";

      throw error;
    }

    if (vendor.archivedAt) {
      const error = new Error("Vendor is archived");

      error.statusCode = 400;
      error.code = "VENDOR_ARCHIVED";

      throw error;
    }

    if (vendor.type !== "vendor" && vendor.type !== "both") {
      const error = new Error("Selected contact is not a vendor");

      error.statusCode = 400;
      error.code = "INVALID_VENDOR_TYPE";

      throw error;
    }
  }

  /**
   * Validate all products used by
   * the purchase order.
   */
  static async validateProducts(items) {
    const productIds = [...new Set(items.map((item) => item.productId))];

    const existingProducts = await database
      .select({
        id: products.id,
        archivedAt: products.archivedAt,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(
      existingProducts.map((product) => [product.id, product]),
    );

    for (const productId of productIds) {
      const product = productMap.get(productId);

      if (!product) {
        const error = new Error(`Product not found: ${productId}`);

        error.statusCode = 404;
        error.code = "PRODUCT_NOT_FOUND";

        throw error;
      }

      if (product.archivedAt) {
        const error = new Error(`Product is archived: ${productId}`);

        error.statusCode = 400;
        error.code = "PRODUCT_ARCHIVED";

        throw error;
      }
    }
  }

  /**
   * Create a Purchase Order.
   *
   * Header and items are created
   * inside one database transaction.
   */
  static async createPurchaseOrder(data) {
    await this.validateVendor(data.vendorId);

    await this.validateProducts(data.items);

    return await database.transaction(async (tx) => {
      const [purchaseOrder] = await tx
        .insert(purchaseOrders)
        .values({
          vendorId: data.vendorId,

          orderDate: data.orderDate,

          reference: data.reference,
        })
        .returning();

      const itemValues = data.items.map((item) => ({
        purchaseOrderId: purchaseOrder.id,

        productId: item.productId,

        quantity: item.quantity,

        unitPrice: item.unitPrice,

        total: item.quantity * item.unitPrice,
      }));

      const createdItems = await tx
        .insert(purchaseOrderItems)
        .values(itemValues)
        .returning();

      return {
        ...purchaseOrder,
        items: createdItems,
      };
    });
  }

  /**
   * Get all active Purchase Orders.
   */
  static async getPurchaseOrders() {
    const orders = await database
      .select()
      .from(purchaseOrders)
      .where(isNull(purchaseOrders.archivedAt));

    if (orders.length === 0) {
      return [];
    }

    const orderIds = orders.map((order) => order.id);

    const items = await database
      .select()
      .from(purchaseOrderItems)
      .where(inArray(purchaseOrderItems.purchaseOrderId, orderIds));

    const itemsByOrder = new Map();

    for (const item of items) {
      if (!itemsByOrder.has(item.purchaseOrderId)) {
        itemsByOrder.set(item.purchaseOrderId, []);
      }

      itemsByOrder.get(item.purchaseOrderId).push(item);
    }

    return orders.map((order) => ({
      ...order,
      items: itemsByOrder.get(order.id) ?? [],
    }));
  }

  /**
   * Get a single active Purchase Order.
   */
  static async getPurchaseOrderById(id) {
    const [purchaseOrder] = await database
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, id))
      .limit(1);

    if (!purchaseOrder || purchaseOrder.archivedAt) {
      const error = new Error("Purchase order not found");

      error.statusCode = 404;
      error.code = "PURCHASE_ORDER_NOT_FOUND";

      throw error;
    }

    const items = await database
      .select()
      .from(purchaseOrderItems)
      .where(eq(purchaseOrderItems.purchaseOrderId, id));

    return {
      ...purchaseOrder,
      items,
    };
  }

  /**
   * Update Purchase Order header.
   *
   * Items are not modified here.
   */
  static async updatePurchaseOrder(id, data) {
    await this.getPurchaseOrderById(id);

    if (data.vendorId !== undefined) {
      await this.validateVendor(data.vendorId);
    }

    const updateData = {};

    if (data.vendorId !== undefined) {
      updateData.vendorId = data.vendorId;
    }

    if (data.orderDate !== undefined) {
      updateData.orderDate = data.orderDate;
    }

    if (data.reference !== undefined) {
      updateData.reference = data.reference;
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields provided for update");

      error.statusCode = 400;
      error.code = "NO_UPDATE_FIELDS";

      throw error;
    }

    const [updatedPurchaseOrder] = await database
      .update(purchaseOrders)
      .set(updateData)
      .where(eq(purchaseOrders.id, id))
      .returning();

    return await this.getPurchaseOrderById(updatedPurchaseOrder.id);
  }

  /**
   * Archive a Purchase Order.
   */
  static async archivePurchaseOrder(id) {
    await this.getPurchaseOrderById(id);

    const [archivedPurchaseOrder] = await database
      .update(purchaseOrders)
      .set({
        archivedAt: new Date(),
      })
      .where(eq(purchaseOrders.id, id))
      .returning();

    return await this.getArchivedPurchaseOrderWithItems(
      archivedPurchaseOrder.id,
    );
  }

  /**
   * Return an archived Purchase Order
   * with its items.
   *
   * Used only after archiving.
   */
  static async getArchivedPurchaseOrderWithItems(id) {
    const [purchaseOrder] = await database
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, id))
      .limit(1);

    const items = await database
      .select()
      .from(purchaseOrderItems)
      .where(eq(purchaseOrderItems.purchaseOrderId, id));

    return {
      ...purchaseOrder,
      items,
    };
  }
}
