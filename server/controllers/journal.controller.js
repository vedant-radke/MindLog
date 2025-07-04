const Journal = require("../models/Journal");
const analyzeJournal = require("../utils/analyzeJournal"); // reused if needed
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/journals
const createJournal = async (req, res) => {
  const { content } = req.body;
  
  try {
    const analysis = await analyzeJournal(content);
    
    const newJournal = new Journal({
      userId: req.userId,
      content,
      analysis,
    });

    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (err) {
    res.status(500).json({ message: "Failed to create journal", error: err.message });
  }
};

// GET /api/journals
const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(journals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch journals", error: err.message });
  }
};

const getSummaryNarrative = async (req, res) => {
  const userId = req.userId;
  const days = parseInt(req.query.days) || 7;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  try {
    const journals = await Journal.find({
      userId,
      createdAt: { $gte: fromDate },
    });

    if (journals.length === 0) {
      return res.status(404).json({ message: "No journals found for the requested period." });
    }

    const combinedContent = journals.map(j => `- ${j.content}`).join("\n");
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-latest" });

    const prompt = `
You are a kind and empathetic mental health assistant. A user has written journals for the past ${days} days.

Your job is to analyze and return a short, human-friendly response in the following format:

Emotion:
<emotional summary in 2-3 lines addressing the user gently>

Solution:
<personalized suggestions or gentle self-help tips in 2-3 lines>

Motivation:
<short, encouraging closing line (e.g., “You’re stronger than you think.”)>

Only output the response in that structure — no extra explanation.

Journals:
${combinedContent}
    `.trim();

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response;
    const summary = response.text();

    res.status(200).json({ summary });

  } catch (error) {
    console.error("❌ AI Summary Failed:", error.message);
    res.status(500).json({ message: "Failed to generate emotional summary." });
  }
};

module.exports = { createJournal, getJournals, getSummaryNarrative };
