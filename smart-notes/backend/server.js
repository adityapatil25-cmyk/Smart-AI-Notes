/*import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

dotenv.config();

// Debug: Check if environment variables are loaded
console.log("🔍 Environment Check:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for large notes
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/share", shareRoutes); // Public share routes

// Default route
app.get("/", (req, res) => {
  res.send("🧠 Smart Notes API is running...");
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

console.log("🔍 Environment Check:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Connect DB
connectDB();

// Test basic route first
app.get("/", (req, res) => {
  res.send("🧠 Smart Notes API is running...");
});

console.log("✅ Basic server setup complete");

// Try adding routes one by one
try {
  console.log("🔄 Loading auth routes...");
  const authRoutes = await import("./routes/authRoutes.js");
  app.use("/api/auth", authRoutes.default);
  console.log("✅ Auth routes loaded");
} catch (error) {
  console.error("❌ Error loading auth routes:", error.message);
}

try {
  console.log("🔄 Loading share routes...");
  const shareRoutes = await import("./routes/shareRoutes.js");
  app.use("/api/share", shareRoutes.default);
  console.log("✅ Share routes loaded");
} catch (error) {
  console.error("❌ Error loading share routes:", error.message);
}

try {
  console.log("🔄 Loading note routes...");
  const noteRoutes = await import("./routes/noteRoutes.js");
  app.use("/api/notes", noteRoutes.default);
  console.log("✅ Note routes loaded");
} catch (error) {
  console.error("❌ Error loading note routes:", error.message);
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/share", shareRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Smart Notes API is running!", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to Smart Notes API", 
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      notes: "/api/notes", 
      share: "/api/share",
      health: "/api/health"
    }
  });
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});