import { Router } from "express";
import authRoute  from "../modules/auth/auth.routes.js";

const route = Router();


route.use("/auth", authRoute);


export default route;