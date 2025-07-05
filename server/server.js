const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Next.js origin
  credentials: true
}));
app.use(express.json());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/chat", chatRoutes);

// Connect DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
