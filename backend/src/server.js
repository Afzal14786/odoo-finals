import app from "./index.js";
import { connectDatabase } from "../database/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.info("Connecting to database...");

        await connectDatabase();

        const server = app.listen(PORT, () => {
            console.info(`Server is running on port ${PORT}`);
        });

        server.on("error", (error) => {
            console.error("HTTP server error:", error);
            process.exit(1);
        });

    } catch (error) {
        console.error("Failed to start application");
        console.error("Error:", error);
        console.error("Message:", error?.message);
        console.error("Stack:", error?.stack);

        process.exit(1);
    }
};

startServer();