import dotenv from "dotenv";
import express from "express";

import route from "./routes/index.routes.js";

dotenv.config();

const app = express();

/*
 * Global middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * Routes
 */
app.use("/api/v1", route);

export default app;