import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
// Middleware: JSON parsing
app.use(express.json());
// Middleware: Enable CORS
app.use(cors());
// Middleware: Logging requests
app.use(morgan("dev"));
// Routes
app.use("/api/auth", authRoutes);
// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Something went wrong" });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
