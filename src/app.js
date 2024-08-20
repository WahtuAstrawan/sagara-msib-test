import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import { apiKeyCheck } from "./middleware/api-key-check.js";
import clothingRouter from "./routes/clothing-route.js";

const app = express();

// Database
connectDatabase();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/v1", apiKeyCheck);

// Route
app.get("/", (req, res) => {
  return res.send(`Server is running on http://localhost:${port}`);
});
app.use("/api/v1/clothing", clothingRouter);

export default app;
