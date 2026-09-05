import { and, eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
    purchasePayments,
    vendorBills,
    vendorBillItems,
    journalEntries,
    journalItems,
    journals,
    chartOfAccounts,
} from "../../../database/schema/index.js";

export class PurchasePaymentService {
    static async createPurchasePayment(data) {
        return await database.transaction(async (tx) => {
            const [vendorBill] = await tx
                .select()
                .from(vendorBills)
                .where(eq(vendorBills.id, data.vendorBillId))
                .limit(1);

            if (!vendorBill || vendorBill.archivedAt) {
                const error = new Error("Vendor bill not found");
                error.statusCode = 404;
                error.code = "VENDOR_BILL_NOT_FOUND";
                throw error;
            }

            const billItems = await tx
                .select({
                    total: vendorBillItems.total,
                })
                .from(vendorBillItems)
                .where(
                    eq(
                        vendorBillItems.vendorBillId,
                        data.vendorBillId,
                    ),
                );

            const billTotal = billItems.reduce(
                (total, item) => total + item.total,
                0,
            );

            const existingPayments = await tx
                .select({
                    amount: purchasePayments.amount,
                })
                .from(purchasePayments)
                .where(
                    eq(
                        purchasePayments.vendorBillId,
                        data.vendorBillId,
                    ),
                );

            const paidAmount = existingPayments.reduce(
                (total, payment) => total + payment.amount,
                0,
            );

            const outstandingAmount = billTotal - paidAmount;

            if (outstandingAmount <= 0) {
                const error = new Error(
                    "Vendor bill is already fully paid",
                );

                error.statusCode = 400;
                error.code = "VENDOR_BILL_ALREADY_PAID";

                throw error;
            }

            if (data.amount > outstandingAmount) {
                const error = new Error(
                    "Payment amount exceeds outstanding vendor bill amount",
                );

                error.statusCode = 400;
                error.code = "PAYMENT_AMOUNT_EXCEEDS_OUTSTANDING";

                throw error;
            }

            const paymentAccountName =
                data.paymentMethod === "cash"
                    ? "Cash"
                    : "Bank";

            const journalType = data.paymentMethod;

            const [accountsPayableAccount] = await tx
                .select()
                .from(chartOfAccounts)
                .where(
                    and(
                        eq(
                            chartOfAccounts.accountName,
                            "Accounts Payable",
                        ),
                        isNull(chartOfAccounts.archivedAt),
                    ),
                )
                .limit(1);

            if (!accountsPayableAccount) {
                const error = new Error(
                    "Accounts Payable account is not configured",
                );

                error.statusCode = 500;
                error.code = "ACCOUNTS_PAYABLE_ACCOUNT_NOT_FOUND";

                throw error;
            }

            const [paymentAccount] = await tx
                .select()
                .from(chartOfAccounts)
                .where(
                    and(
                        eq(
                            chartOfAccounts.accountName,
                            paymentAccountName,
                        ),
                        isNull(chartOfAccounts.archivedAt),
                    ),
                )
                .limit(1);

            if (!paymentAccount) {
                const error = new Error(
                    `${paymentAccountName} account is not configured`,
                );

                error.statusCode = 500;
                error.code = `${paymentAccountName.toUpperCase()}_ACCOUNT_NOT_FOUND`;

                throw error;
            }

            const [journal] = await tx
                .select()
                .from(journals)
                .where(
                    and(
                        eq(journals.journalType, journalType),
                        isNull(journals.archivedAt),
                    ),
                )
                .limit(1);

            if (!journal) {
                const error = new Error(
                    `${paymentAccountName} journal is not configured`,
                );

                error.statusCode = 500;
                error.code = `${journalType.toUpperCase()}_JOURNAL_NOT_FOUND`;

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
                        accountId: accountsPayableAccount.id,
                        debit: data.amount,
                        credit: 0,
                    },
                    {
                        journalEntryId: journalEntry.id,
                        accountId: paymentAccount.id,
                        debit: 0,
                        credit: data.amount,
                    },
                ])
                .returning();

            const [purchasePayment] = await tx
                .insert(purchasePayments)
                .values({
                    vendorBillId: data.vendorBillId,
                    paymentDate: data.paymentDate,
                    paymentMethod: data.paymentMethod,
                    amount: data.amount,
                    reference: data.reference,
                    journalEntryId: journalEntry.id,
                })
                .returning();

            return {
                ...purchasePayment,

                journalEntry: {
                    ...journalEntry,
                    items: journalEntryItems,
                },
            };
        });
    }

    static async getPurchasePayments() {
        return await database
            .select()
            .from(purchasePayments);
    }


    static async getPurchasePaymentById(id) {
        const [purchasePayment] = await database
            .select()
            .from(purchasePayments)
            .where(eq(purchasePayments.id, id))
            .limit(1);

        if (!purchasePayment) {
            const error = new Error("Purchase payment not found");
            error.statusCode = 404;
            error.code = "PURCHASE_PAYMENT_NOT_FOUND";
            throw error;
        }

        return purchasePayment;
    }
}

export default PurchasePaymentService;