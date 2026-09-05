import { Router } from "express";
import authRoute  from "../modules/auth/auth.routes.js";
import contactRoute  from "../modules/contact/contact.routes.js";

const route = Router();


route.use("/auth", authRoute);
route.use("/contacts", contactRoute);

export default route;