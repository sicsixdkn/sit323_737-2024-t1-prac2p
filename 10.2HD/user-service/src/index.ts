import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

// Load environment variables from the .env file
dotenv.config();

// Create an Express app
const app = express();
const port = process.env.PORT || 80;

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());

// Endpoints
app.use("/api/users", userRoutes);

// Start the server
app.listen(port, async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log(`User Service is running on port ${port}`);
    } catch (error) {
        // If there is an error connecting to the database, log the error and exit the process
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
});