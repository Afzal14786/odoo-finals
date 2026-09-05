import { eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";
import { contacts } from "../../../database/schema/index.js";

export class ContactService {
  /**
   * Create a new contact
   */
  static async createContact(data) {
    const [contact] = await database
      .insert(contacts)
      .values({
        name: data.name,
        type: data.type,
        email: data.email || null,
        mobile: data.mobile || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
        profileUrl: data.profileUrl || null,
      })
      .returning();

    return contact;
  }

  /**
   * Get all active contacts
   */
  static async getContacts() {
    return await database
      .select()
      .from(contacts)
      .where(isNull(contacts.archivedAt));
  }

  /**
   * Get a single active contact
   */
  static async getContactById(id) {
    const [contact] = await database
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);

    if (!contact || contact.archivedAt) {
      const error = new Error("Contact not found");
      error.statusCode = 404;
      error.code = "CONTACT_NOT_FOUND";

      throw error;
    }

    return contact;
  }

  /**
   * Update a contact
   */
  static async updateContact(id, data) {
    await this.getContactById(id);

    const updateData = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    if (data.email !== undefined) {
      updateData.email = data.email || null;
    }

    if (data.mobile !== undefined) {
      updateData.mobile = data.mobile || null;
    }

    if (data.address !== undefined) {
      updateData.address = data.address || null;
    }

    if (data.city !== undefined) {
      updateData.city = data.city || null;
    }

    if (data.state !== undefined) {
      updateData.state = data.state || null;
    }

    if (data.pincode !== undefined) {
      updateData.pincode = data.pincode || null;
    }

    if (data.profileUrl !== undefined) {
      updateData.profileUrl = data.profileUrl || null;
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields provided for update");
      error.statusCode = 400;
      error.code = "NO_UPDATE_FIELDS";

      throw error;
    }

    const [updatedContact] = await database
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id))
      .returning();

    return updatedContact;
  }

  /**
   * Archive a contact
   */
  static async archiveContact(id) {
    await this.getContactById(id);

    const [archivedContact] = await database
      .update(contacts)
      .set({
        archivedAt: new Date(),
      })
      .where(eq(contacts.id, id))
      .returning();

    return archivedContact;
  }
}
