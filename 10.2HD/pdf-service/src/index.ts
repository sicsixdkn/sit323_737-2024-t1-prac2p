import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import {Server} from "socket.io";
import pdfRoutes from "./routes/pdfRoutes";
import http from "http";
import cors from "cors";

// Load environment variables from the .env file
dotenv.config();

// Create an Express app
const app = express();
const port = process.env.PORT || 80;

// Enable CORS
app.use(cors());

// Create an HTTP server and pass the Express app to the server
const server = http.createServer(app);

// Create a new instance of Socket.IO and pass the server, setting the CORS policy
const io = new Server(server, {
    path: "/api/pdf/socket.io",
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(express.json());

// Endpoints
app.use("/api/pdf", pdfRoutes(io));
// Added for health check
app.get("/", (req, res) => {
    res.status(200).send("PDF Service is running");
});

// Start the server
server.listen(port, async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log(`PDF Service is running on port ${port}`);
    } catch (error) {
        // If there is an error connecting to the database, log the error and exit the process
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
});