import { Router } from "express";
import { ContactController } from "./contact.controller.js";

const contactRoute = Router();

contactRoute.post("/", ContactController.createContact);
contactRoute.get("/", ContactController.getContacts);
contactRoute.get("/:id", ContactController.getContactById);
contactRoute.patch("/:id", ContactController.updateContact);
contactRoute.patch("/:id/archive", ContactController.archiveContact);

export default contactRoute;
