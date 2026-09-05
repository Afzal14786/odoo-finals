import { Router } from "express";
import authRoute  from "../modules/auth/auth.routes.js";
import contactRoute  from "../modules/contact/contact.routes.js";
import productRoute  from "../modules/product/product.routes.js";

const route = Router();


route.use("/auth", authRoute);
route.use("/contacts", contactRoute);
route.use("/products", productRoute);

export default route;