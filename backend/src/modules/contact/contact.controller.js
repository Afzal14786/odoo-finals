import {
  contactIdSchema,
  createContactSchema,
  updateContactSchema,
} from "./contact.validation.js";
import { ContactService } from "./contact.service.js";

export class ContactController {
  /**
   * POST /contacts
   */
  static async createContact(req, res, next) {
    try {
      const validatedData = createContactSchema.parse(req.body);

      const contact = await ContactService.createContact(validatedData);

      return res.status(201).json({
        success: true,
        message: "Contact created successfully",
        data: {
          contact,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /contacts
   */
  static async getContacts(req, res, next) {
    try {
      const contacts = await ContactService.getContacts();

      return res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: {
          contacts,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /contacts/:id
   */
  static async getContactById(req, res, next) {
    try {
      const { id } = contactIdSchema.parse(req.params);

      const contact = await ContactService.getContactById(id);

      return res.status(200).json({
        success: true,
        message: "Contact retrieved successfully",
        data: {
          contact,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /contacts/:id
   */
  static async updateContact(req, res, next) {
    try {
      const { id } = contactIdSchema.parse(req.params);

      const validatedData = updateContactSchema.parse(req.body);

      const contact = await ContactService.updateContact(id, validatedData);

      return res.status(200).json({
        success: true,
        message: "Contact updated successfully",
        data: {
          contact,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /contacts/:id/archive
   */
  static async archiveContact(req, res, next) {
    try {
      const { id } = contactIdSchema.parse(req.params);

      const contact = await ContactService.archiveContact(id);

      return res.status(200).json({
        success: true,
        message: "Contact archived successfully",
        data: {
          contact,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
