// index.ts
import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT || 3000;

const DB: string | undefined =
    process.env.ENV_FOR_DOCKER === "true"
        ? process.env.MONGODB_URI_DOCKER
        : process.env.MONGODB_URI 
        // || process.env.MONGODB_URI_DOCKER;

const connectDb = async (): Promise<void> => {
    if (!DB) {
        throw new Error("Database connection string is not provided. -b");
    }

    try {
        const connect = await mongoose.connect(DB, {
            // serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            // connectTimeoutMS: 30000
        });
        console.log(
            "💚[database connected]:",
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.error("💢Failed to connect to the database");
        console.error(error);
    }
};
connectDb();

app.listen(port, () => {
    console.log(`💚[server]: Server is running at http://localhost:${port}`);
});
