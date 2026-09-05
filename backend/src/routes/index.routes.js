import { Router } from "express";
import authRoute  from "../modules/auth/auth.routes.js";
import contactRoute  from "../modules/contact/contact.routes.js";
import productRoute  from "../modules/product/product.routes.js";
import chartOfAccountRoute from "../modules/chart-of-account/chartOfAccount.routes.js"
import journalRoute from "../modules/journal/journal.routes.js";
import journalEntryRoute from "../modules/journal-entry/journalEntry.routes.js";

const route = Router();


route.use("/auth", authRoute);
route.use("/contacts", contactRoute);
route.use("/products", productRoute);
route.use("/coa", chartOfAccountRoute);  // coa stands for chart-of-account samjhe kia
route.use("/journals", journalRoute);
route.use("/journal-entries", journalEntryRoute);

export default route;