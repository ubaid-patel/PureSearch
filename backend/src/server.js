import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import searchRoute from "./routes/searchRoute.js";

dotenv.config();

const app = express();

// 🔧 Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Path to built frontend
const frontendPath = path.join(__dirname, "templates");

app.use(cors());
app.use(express.json());

// ✅ Serve static frontend
app.use(express.static(frontendPath));

// ✅ API routes
app.use("/search", searchRoute);

// 🔥 SPA fallback (IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});