import { eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";
import { products } from "../../../database/schema/index.js";

export class ProductService {

    static async createProduct(data) {
        const [product] = await database
            .insert(products)
            .values({
                name: data.name,
                type: data.type,
                salesPrice: data.salesPrice,
                purchasePrice: data.purchasePrice,
                category: data.category,
            })
            .returning();

        return product;
    }

    static async getProducts() {
        return await database
            .select()
            .from(products)
            .where(isNull(products.archivedAt));
    }

    static async getProductById(id) {
        const [product] = await database
            .select()
            .from(products)
            .where(eq(products.id, id))
            .limit(1);

        if (!product || product.archivedAt) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            error.code = "PRODUCT_NOT_FOUND";

            throw error;
        }

        return product;
    }

    static async updateProduct(id, data) {
        await this.getProductById(id);

        const updateData = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.type !== undefined) {
            updateData.type = data.type;
        }

        if (data.salesPrice !== undefined) {
            updateData.salesPrice = data.salesPrice;
        }

        if (data.purchasePrice !== undefined) {
            updateData.purchasePrice = data.purchasePrice;
        }

        if (data.category !== undefined) {
            updateData.category = data.category;
        }

        if (Object.keys(updateData).length === 0) {
            const error = new Error("No fields provided for update");
            error.statusCode = 400;
            error.code = "NO_UPDATE_FIELDS";

            throw error;
        }

        const [updatedProduct] = await database
            .update(products)
            .set(updateData)
            .where(eq(products.id, id))
            .returning();

        return updatedProduct;
    }

    static async archiveProduct(id) {
        await this.getProductById(id);

        const [archivedProduct] = await database
            .update(products)
            .set({
                archivedAt: new Date(),
            })
            .where(eq(products.id, id))
            .returning();

        return archivedProduct;
    }
}