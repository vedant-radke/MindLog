const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: {
    type: String,
    required: true,
  },
  analysis: {
    sentiment: String,
    emotions: [String],
    suggestions: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model("Journal", journalSchema);
