import { and, eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  customerPayments,
  customerInvoices,
  customerInvoiceItems,
  chartOfAccounts,
  journals,
  journalEntries,
  journalItems,
} from "../../../database/schema/index.js";

export class CustomerPaymentService {
  static async createCustomerPayment(data) {
    return await database.transaction(async (tx) => {
      const [invoice] = await tx
        .select()
        .from(customerInvoices)
        .where(eq(customerInvoices.id, data.customerInvoiceId))
        .limit(1);

      if (!invoice || invoice.archivedAt) {
        const error = new Error("Customer invoice not found");

        error.statusCode = 404;
        error.code = "CUSTOMER_INVOICE_NOT_FOUND";

        throw error;
      }

      const invoiceItems = await tx
        .select()
        .from(customerInvoiceItems)
        .where(eq(customerInvoiceItems.customerInvoiceId, invoice.id));

      if (invoiceItems.length === 0) {
        const error = new Error("Customer invoice has no items");

        error.statusCode = 400;
        error.code = "CUSTOMER_INVOICE_EMPTY";

        throw error;
      }

      const invoiceTotal = invoiceItems.reduce(
        (total, item) => total + item.total,
        0,
      );

      const previousPayments = await tx
        .select({
          amount: customerPayments.amount,
        })
        .from(customerPayments)
        .where(eq(customerPayments.customerInvoiceId, invoice.id));

      const paidAmount = previousPayments.reduce(
        (total, payment) => total + payment.amount,
        0,
      );

      const outstandingAmount = invoiceTotal - paidAmount;

      if (outstandingAmount <= 0) {
        const error = new Error("Customer invoice has already been fully paid");

        error.statusCode = 400;
        error.code = "CUSTOMER_INVOICE_ALREADY_PAID";

        throw error;
      }

      if (data.amount > outstandingAmount) {
        const error = new Error(
          `Payment exceeds outstanding amount of ${outstandingAmount}`,
        );

        error.statusCode = 400;
        error.code = "PAYMENT_EXCEEDS_OUTSTANDING";

        throw error;
      }

      const [receivableAccount] = await tx
        .select()
        .from(chartOfAccounts)
        .where(
          and(
            eq(chartOfAccounts.accountName, "Accounts Receivable"),
            isNull(chartOfAccounts.archivedAt),
          ),
        )
        .limit(1);

      if (!receivableAccount) {
        const error = new Error("Accounts Receivable account not found");

        error.statusCode = 404;
        error.code = "RECEIVABLE_ACCOUNT_NOT_FOUND";

        throw error;
      }

      const paymentAccountName =
        data.paymentMethod === "cash" ? "Cash" : "Bank";

      const [paymentAccount] = await tx
        .select()
        .from(chartOfAccounts)
        .where(
          and(
            eq(chartOfAccounts.accountName, paymentAccountName),
            isNull(chartOfAccounts.archivedAt),
          ),
        )
        .limit(1);

      if (!paymentAccount) {
        const error = new Error(`${paymentAccountName} account not found`);

        error.statusCode = 404;
        error.code =
          data.paymentMethod === "cash"
            ? "CASH_ACCOUNT_NOT_FOUND"
            : "BANK_ACCOUNT_NOT_FOUND";

        throw error;
      }

      const [journal] = await tx
        .select()
        .from(journals)
        .where(
          and(
            eq(journals.journalType, data.paymentMethod),
            isNull(journals.archivedAt),
          ),
        )
        .limit(1);

      if (!journal) {
        const error = new Error(`${data.paymentMethod} journal not found`);

        error.statusCode = 404;
        error.code = "PAYMENT_JOURNAL_NOT_FOUND";

        throw error;
      }

      const [journalEntry] = await tx
        .insert(journalEntries)
        .values({
          journalId: journal.id,
          entryDate: data.paymentDate,
          reference: data.reference,
        })
        .returning();

      const journalEntryItems = await tx
        .insert(journalItems)
        .values([
          {
            journalEntryId: journalEntry.id,
            accountId: paymentAccount.id,
            debit: data.amount,
            credit: 0,
          },
          {
            journalEntryId: journalEntry.id,
            accountId: receivableAccount.id,
            debit: 0,
            credit: data.amount,
          },
        ])
        .returning();

      const [customerPayment] = await tx
        .insert(customerPayments)
        .values({
          customerInvoiceId: invoice.id,

          paymentDate: data.paymentDate,

          paymentMethod: data.paymentMethod,

          amount: data.amount,

          reference: data.reference,

          journalEntryId: journalEntry.id,
        })
        .returning();

      return {
        ...customerPayment,

        journalEntry: {
          ...journalEntry,
          items: journalEntryItems,
        },

        invoice: {
          id: invoice.id,
          customerId: invoice.customerId,
          salesOrderId: invoice.salesOrderId,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
        },

        paymentSummary: {
          invoiceTotal,
          paidAmount: paidAmount + data.amount,
          outstandingAmount: outstandingAmount - data.amount,
        },
      };
    });
  }

  static async getCustomerPayments() {
    const payments = await database.select().from(customerPayments);

    return payments;
  }

  static async getCustomerPaymentById(id) {
    const [payment] = await database
      .select()
      .from(customerPayments)
      .where(eq(customerPayments.id, id))
      .limit(1);

    if (!payment) {
      const error = new Error("Customer payment not found");

      error.statusCode = 404;
      error.code = "CUSTOMER_PAYMENT_NOT_FOUND";

      throw error;
    }

    return payment;
  }
}

export default CustomerPaymentService;
