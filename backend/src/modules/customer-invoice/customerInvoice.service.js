import { and, eq, isNull, inArray } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  customerInvoices,
  customerInvoiceItems,
  salesOrders,
  salesOrderItems,
  contacts,
  products,
} from "../../../database/schema/index.js";

export class CustomerInvoiceService {
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

  static async createCustomerInvoice(data) {
    return await database.transaction(async (tx) => {
      const [salesOrder] = await tx
        .select()
        .from(salesOrders)
        .where(eq(salesOrders.id, data.salesOrderId))
        .limit(1);

      if (!salesOrder || salesOrder.archivedAt) {
        const error = new Error("Sales order not found");

        error.statusCode = 404;
        error.code = "SALES_ORDER_NOT_FOUND";

        throw error;
      }

      await CustomerInvoiceService.validateCustomer(tx, salesOrder.customerId);

      const [existingInvoice] = await tx
        .select({
          id: customerInvoices.id,
        })
        .from(customerInvoices)
        .where(eq(customerInvoices.salesOrderId, salesOrder.id))
        .limit(1);

      if (existingInvoice) {
        const error = new Error("Sales order has already been invoiced");

        error.statusCode = 400;
        error.code = "SALES_ORDER_ALREADY_INVOICED";

        throw error;
      }

      const orderItems = await tx
        .select()
        .from(salesOrderItems)
        .where(eq(salesOrderItems.salesOrderId, salesOrder.id));

      if (orderItems.length === 0) {
        const error = new Error("Sales order has no items");

        error.statusCode = 400;
        error.code = "SALES_ORDER_EMPTY";

        throw error;
      }

      const productIds = [...new Set(orderItems.map((item) => item.productId))];

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

      const [customerInvoice] = await tx
        .insert(customerInvoices)
        .values({
          customerId: salesOrder.customerId,
          salesOrderId: salesOrder.id,
          invoiceDate: data.invoiceDate,
          dueDate: data.dueDate,
          reference: data.reference,
        })
        .returning();

      const invoiceItems = await tx
        .insert(customerInvoiceItems)
        .values(
          orderItems.map((item) => ({
            customerInvoiceId: customerInvoice.id,

            productId: item.productId,

            quantity: item.quantity,

            unitPrice: item.unitPrice,

            tax: item.tax,

            total: item.quantity * item.unitPrice + item.tax,
          })),
        )
        .returning();

      return {
        ...customerInvoice,
        items: invoiceItems,
      };
    });
  }

  static async getCustomerInvoices() {
    const invoices = await database
      .select()
      .from(customerInvoices)
      .where(isNull(customerInvoices.archivedAt));

    return invoices;
  }

  static async getCustomerInvoiceById(id) {
    const [customerInvoice] = await database
      .select()
      .from(customerInvoices)
      .where(eq(customerInvoices.id, id))
      .limit(1);

    if (!customerInvoice || customerInvoice.archivedAt) {
      const error = new Error("Customer invoice not found");

      error.statusCode = 404;
      error.code = "CUSTOMER_INVOICE_NOT_FOUND";

      throw error;
    }

    const items = await database
      .select()
      .from(customerInvoiceItems)
      .where(eq(customerInvoiceItems.customerInvoiceId, customerInvoice.id));

    return {
      ...customerInvoice,
      items,
    };
  }

  static async updateCustomerInvoice(id, data) {
    const [existingInvoice] = await database
      .select()
      .from(customerInvoices)
      .where(eq(customerInvoices.id, id))
      .limit(1);

    if (!existingInvoice || existingInvoice.archivedAt) {
      const error = new Error("Customer invoice not found");

      error.statusCode = 404;
      error.code = "CUSTOMER_INVOICE_NOT_FOUND";

      throw error;
    }

    const [updatedInvoice] = await database
      .update(customerInvoices)
      .set(data)
      .where(eq(customerInvoices.id, id))
      .returning();

    const items = await database
      .select()
      .from(customerInvoiceItems)
      .where(eq(customerInvoiceItems.customerInvoiceId, id));

    return {
      ...updatedInvoice,
      items,
    };
  }

  static async archiveCustomerInvoice(id) {
    const [existingInvoice] = await database
      .select()
      .from(customerInvoices)
      .where(eq(customerInvoices.id, id))
      .limit(1);

    if (!existingInvoice || existingInvoice.archivedAt) {
      const error = new Error("Customer invoice not found");

      error.statusCode = 404;
      error.code = "CUSTOMER_INVOICE_NOT_FOUND";

      throw error;
    }

    const [archivedInvoice] = await database
      .update(customerInvoices)
      .set({
        archivedAt: new Date(),
      })
      .where(eq(customerInvoices.id, id))
      .returning();

    return archivedInvoice;
  }
}

export default CustomerInvoiceService;
