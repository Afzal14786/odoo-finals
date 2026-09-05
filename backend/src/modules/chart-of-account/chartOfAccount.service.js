import { eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";
import { chartOfAccounts } from "../../../database/schema/index.js";

export class ChartOfAccountService {
    static async createAccount(data) {
        const [account] = await database
            .insert(chartOfAccounts)
            .values({
                accountName: data.accountName,
                accountType: data.accountType,
            })
            .returning();

        return account;
    }

    static async getAccounts() {
        return await database
            .select()
            .from(chartOfAccounts)
            .where(isNull(chartOfAccounts.archivedAt));
    }

    static async getAccountById(id) {
        const [account] = await database
            .select()
            .from(chartOfAccounts)
            .where(eq(chartOfAccounts.id, id))
            .limit(1);

        if (!account || account.archivedAt) {
            const error = new Error("Account not found");

            error.statusCode = 404;
            error.code = "ACCOUNT_NOT_FOUND";

            throw error;
        }

        return account;
    }

    static async updateAccount(id, data) {
        await this.getAccountById(id);

        const updateData = {};

        if (data.accountName !== undefined) {
            updateData.accountName = data.accountName;
        }

        if (data.accountType !== undefined) {
            updateData.accountType = data.accountType;
        }

        if (Object.keys(updateData).length === 0) {
            const error = new Error(
                "No fields provided for update",
            );

            error.statusCode = 400;
            error.code = "NO_UPDATE_FIELDS";

            throw error;
        }

        const [updatedAccount] = await database
            .update(chartOfAccounts)
            .set(updateData)
            .where(eq(chartOfAccounts.id, id))
            .returning();

        return updatedAccount;
    }

    static async archiveAccount(id) {
        await this.getAccountById(id);

        const [archivedAccount] = await database
            .update(chartOfAccounts)
            .set({
                archivedAt: new Date(),
            })
            .where(eq(chartOfAccounts.id, id))
            .returning();

        return archivedAccount;
    }
}