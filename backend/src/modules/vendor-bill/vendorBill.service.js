import { and, eq, isNull, inArray } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  vendorBills,
  vendorBillItems,
  contacts,
  products,
  purchaseOrders,
  journals,
  journalEntries,
  journalItems,
  chartOfAccounts,
} from "../../../database/schema/index.js";

export class VendorBillService {
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

  static async validatePurchaseOrder(purchaseOrderId) {
    const [purchaseOrder] = await database
      .select({
        id: purchaseOrders.id,
        vendorId: purchaseOrders.vendorId,
        archivedAt: purchaseOrders.archivedAt,
      })
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, purchaseOrderId))
      .limit(1);

    if (!purchaseOrder) {
      const error = new Error("Purchase order not found");

      error.statusCode = 404;
      error.code = "PURCHASE_ORDER_NOT_FOUND";

      throw error;
    }

    if (purchaseOrder.archivedAt) {
      const error = new Error("Purchase order is archived");

      error.statusCode = 400;
      error.code = "PURCHASE_ORDER_ARCHIVED";

      throw error;
    }

    return purchaseOrder;
  }

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

  static async createVendorBill(data) {
    await this.validateVendor(data.vendorId);

    const purchaseOrder = await this.validatePurchaseOrder(
      data.purchaseOrderId,
    );

    if (purchaseOrder.vendorId !== data.vendorId) {
      const error = new Error("Vendor does not match purchase order vendor");

      error.statusCode = 400;
      error.code = "VENDOR_PURCHASE_ORDER_MISMATCH";

      throw error;
    }

    await this.validateProducts(data.items);

    return await database.transaction(async (tx) => {
      const [vendorBill] = await tx
        .insert(vendorBills)
        .values({
          vendorId: data.vendorId,
          purchaseOrderId: data.purchaseOrderId,
          billDate: data.billDate,
          dueDate: data.dueDate,
          reference: data.reference,
        })
        .returning();

      const itemValues = data.items.map((item) => ({
        vendorBillId: vendorBill.id,

        productId: item.productId,

        quantity: item.quantity,

        unitPrice: item.unitPrice,

        total: item.quantity * item.unitPrice,
      }));

      const createdItems = await tx
        .insert(vendorBillItems)
        .values(itemValues)
        .returning();


      const billTotal = createdItems.reduce(
        (total, item) => total + item.total,
        0,
      );

      const [purchaseJournal] = await tx
        .select()
        .from(journals)
        .where(
          and(
            eq(journals.journalType, "purchase"),
            isNull(journals.archivedAt),
          ),
        )
        .limit(1);

      if (!purchaseJournal) {
        const error = new Error("Purchase journal is not configured");

        error.statusCode = 500;
        error.code = "PURCHASE_JOURNAL_NOT_FOUND";

        throw error;
      }

      const [purchasesExpenseAccount] = await tx
        .select()
        .from(chartOfAccounts)
        .where(
          and(
            eq(chartOfAccounts.accountName, "Purchases Expense"),
            isNull(chartOfAccounts.archivedAt),
          ),
        )
        .limit(1);

      if (!purchasesExpenseAccount) {
        const error = new Error("Purchases Expense account is not configured");

        error.statusCode = 500;
        error.code = "PURCHASES_EXPENSE_ACCOUNT_NOT_FOUND";

        throw error;
      }

      const [accountsPayable] = await tx
        .select()
        .from(chartOfAccounts)
        .where(
          and(
            eq(chartOfAccounts.accountName, "Accounts Payable"),
            isNull(chartOfAccounts.archivedAt),
          ),
        )
        .limit(1);

      if (!accountsPayable) {
        const error = new Error("Accounts Payable account is not configured");

        error.statusCode = 500;
        error.code = "ACCOUNTS_PAYABLE_ACCOUNT_NOT_FOUND";

        throw error;
      }

      const [journalEntry] = await tx
        .insert(journalEntries)
        .values({
          journalId: purchaseJournal.id,

          entryDate: data.billDate,

          reference: data.reference,
        })
        .returning();

      const journalEntryItems = await tx
        .insert(journalItems)
        .values([
          {
            journalEntryId: journalEntry.id,

            accountId: purchasesExpenseAccount.id,

            debit: billTotal,

            credit: 0,
          },

          {
            journalEntryId: journalEntry.id,

            accountId: accountsPayable.id,

            debit: 0,

            credit: billTotal,
          },
        ])
        .returning();

      return {
        ...vendorBill,

        items: createdItems,

        journalEntry: {
          ...journalEntry,

          items: journalEntryItems,
        },

        billTotal,
      };
    });
  }

  static async getVendorBills() {
    const bills = await database
      .select()
      .from(vendorBills)
      .where(isNull(vendorBills.archivedAt));

    if (bills.length === 0) {
      return [];
    }

    const billIds = bills.map((bill) => bill.id);

    const items = await database
      .select()
      .from(vendorBillItems)
      .where(inArray(vendorBillItems.vendorBillId, billIds));

    const itemsByBill = new Map();

    for (const item of items) {
      if (!itemsByBill.has(item.vendorBillId)) {
        itemsByBill.set(item.vendorBillId, []);
      }

      itemsByBill.get(item.vendorBillId).push(item);
    }

    return bills.map((bill) => ({
      ...bill,
      items: itemsByBill.get(bill.id) ?? [],
    }));
  }

  static async getVendorBillById(id) {
    const [vendorBill] = await database
      .select()
      .from(vendorBills)
      .where(eq(vendorBills.id, id))
      .limit(1);

    if (!vendorBill || vendorBill.archivedAt) {
      const error = new Error("Vendor bill not found");

      error.statusCode = 404;
      error.code = "VENDOR_BILL_NOT_FOUND";

      throw error;
    }

    const items = await database
      .select()
      .from(vendorBillItems)
      .where(eq(vendorBillItems.vendorBillId, id));

    return {
      ...vendorBill,
      items,
    };
  }

  static async updateVendorBill(id, data) {
    const existingVendorBill = await this.getVendorBillById(id);

    if (data.vendorId !== undefined) {
      await this.validateVendor(data.vendorId);
    }

    const billDate = data.billDate ?? existingVendorBill.billDate;
    const dueDate = data.dueDate ?? existingVendorBill.dueDate;

    if (billDate > dueDate) {
      const error = new Error("Due date cannot be before bill date");

      error.statusCode = 400;
      error.code = "INVALID_VENDOR_BILL_DATE_RANGE";

      throw error;
    }

    const updateData = {};

    if (data.vendorId !== undefined) {
      updateData.vendorId = data.vendorId;
    }

    if (data.billDate !== undefined) {
      updateData.billDate = data.billDate;
    }

    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate;
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

    const [updatedVendorBill] = await database
      .update(vendorBills)
      .set(updateData)
      .where(eq(vendorBills.id, id))
      .returning();

    return await this.getVendorBillById(updatedVendorBill.id);
  }

  static async archiveVendorBill(id) {
    await this.getVendorBillById(id);

    const [archivedVendorBill] = await database
      .update(vendorBills)
      .set({
        archivedAt: new Date(),
      })
      .where(eq(vendorBills.id, id))
      .returning();

    return await this.getArchivedVendorBillWithItems(archivedVendorBill.id);
  }

  static async getArchivedVendorBillWithItems(id) {
    const [vendorBill] = await database
      .select()
      .from(vendorBills)
      .where(eq(vendorBills.id, id))
      .limit(1);

    const items = await database
      .select()
      .from(vendorBillItems)
      .where(eq(vendorBillItems.vendorBillId, id));

    return {
      ...vendorBill,
      items,
    };
  }
}

export default VendorBillService;
