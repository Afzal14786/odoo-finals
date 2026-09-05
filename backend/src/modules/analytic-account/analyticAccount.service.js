import { eq, isNull } from "drizzle-orm";
import { database } from "../../../database/index.js";
import { analyticAccounts } from "../../../database/schema/index.js";

export class AnalyticAccountService {
  static async createAnalyticAccount(data) {
    const [analyticAccount] = await database
      .insert(analyticAccounts)
      .values({
        name: data.name,
        type: data.type,
      })
      .returning();

    return analyticAccount;
  }

  static async getAnalyticAccounts() {
    return await database
      .select()
      .from(analyticAccounts)
      .where(isNull(analyticAccounts.archivedAt));
  }

  static async getAnalyticAccountById(id) {
    const [analyticAccount] = await database
      .select()
      .from(analyticAccounts)
      .where(eq(analyticAccounts.id, id))
      .limit(1);

    if (!analyticAccount || analyticAccount.archivedAt) {
      const error = new Error("Analytic account not found");

      error.statusCode = 404;
      error.code = "ANALYTIC_ACCOUNT_NOT_FOUND";

      throw error;
    }

    return analyticAccount;
  }

  static async updateAnalyticAccount(id, data) {
    await this.getAnalyticAccountById(id);

    const updateData = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields provided for update");

      error.statusCode = 400;
      error.code = "NO_UPDATE_FIELDS";

      throw error;
    }

    const [updatedAnalyticAccount] = await database
      .update(analyticAccounts)
      .set(updateData)
      .where(eq(analyticAccounts.id, id))
      .returning();

    return updatedAnalyticAccount;
  }

  static async archiveAnalyticAccount(id) {
    await this.getAnalyticAccountById(id);

    const [archivedAnalyticAccount] = await database
      .update(analyticAccounts)
      .set({
        archivedAt: new Date(),
      })
      .where(eq(analyticAccounts.id, id))
      .returning();

    return archivedAnalyticAccount;
  }
}
