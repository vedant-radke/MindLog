const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String, // This will store the encrypted content
    required: true,
  },
  iv: {
    type: String, // Initialization vector for AES-GCM
    required: true,
  },
  tag: {
    type: String, // Authentication tag for AES-GCM
    required: true,
  },
  analysis: {
    sentiment: { type: String },
    emotions: [{ type: String }],
    suggestions: [{ type: String }],
  },
}, { timestamps: true });

module.exports = mongoose.model("Journal", journalSchema);
