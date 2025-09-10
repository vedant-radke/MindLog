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
  origin: "mindlog-in.vercel.app", 
  credentials: true
}));
app.use(express.json());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/chat", chatRoutes);

// 📅 Start scheduled notification job (9 PM reminder)
if (process.env.NODE_ENV === "production" || process.env.ENABLE_CRON === "true") {
  require("./cron/notifyMissedJournal");
}

// Connect DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
