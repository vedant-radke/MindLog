const Journal = require("../models/Journal");
const User = require("../models/User");
const analyzeJournal = require("../utils/analyzeJournal"); // reused if needed
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { encrypt, decrypt } = require("../utils/encryption");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/journals
const createJournal = async (req, res) => {
  const { content } = req.body;

  try {
    const analysis = await analyzeJournal(content);

    // encryption
    const { encryptedContent, iv, tag } = encrypt(content);

    const newJournal = new Journal({
      userId: req.userId,
      content: encryptedContent,
      iv,
      tag,
      analysis,
    });

    await newJournal.save();

    const user = await User.findById(req.userId);

    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // midnight for date-only comparison

      if (!user.lastJournalDate) {
        // First journal ever
        user.streak = 1;
      } else {
        const lastDate = new Date(user.lastJournalDate);
        lastDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Already wrote today → streak unchanged
        } else if (diffDays === 1) {
          // Wrote yesterday → increment streak
          user.streak += 1;
        } else {
          // Missed a day → reset streak
          user.streak = 1;
        }
      }

      // Update last journal date
      user.lastJournalDate = today;
      await user.save();
    }

    res.status(201).json(newJournal);
  } catch (err) {
    console.log(err.message);

    res
      .status(500)
      .json({ message: "Failed to create journal", error: err.message });
  }
};

// GET /api/journals
const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    const plainTextJournals = journals.map((journal) => ({
      _id: journal._id,
      content: decrypt(journal.content, journal.iv, journal.tag),
      analysis: journal.analysis,
      createdAt: journal.createdAt,
    }));
    // console.log(plainTextJournals);

    res.status(200).json(plainTextJournals);
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      message: "Failed to fetch journals",
      error: err.message,
    });
  }
};

const normalizeSummary = (rawSummary = "") => {
  const sanitized = rawSummary.replace(/\r\n/g, "\n").trim();
  const sections = {
    Emotion: "",
    Solution: "",
    Motivation: "",
  };

  const sectionRegex =
    /(Emotion|Solution|Motivation)\s*:\s*([\s\S]*?)(?=(Emotion|Solution|Motivation)\s*:|$)/gi;
  let match;

  while ((match = sectionRegex.exec(sanitized)) !== null) {
    const [_, rawKey, rawValue] = match;
    const key = rawKey.charAt(0).toUpperCase() + rawKey.slice(1).toLowerCase();
    sections[key] = rawValue
      .replace(/^[\s-•]+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  const formatted = `Emotion:\n${
    sections.Emotion || "We’re still gathering how you’ve been feeling."
  }\n\nSolution:\n${
    sections.Solution ||
    "Try a grounding exercise or jot down small wins to build consistency."
  }\n\nMotivation:\n${
    sections.Motivation ||
    "Keep showing up for yourself—you’re making meaningful progress."
  }`;

  return formatted.trim();
};

const getSummaryNarrative = async (req, res) => {
  const userId = req.userId;

  try {
    const journals = await Journal.find({ userId })
      .sort({ createdAt: -1 }) // most recent first
      .limit(7); // get last 7 journals

    if (journals.length === 0) {
      return res
        .status(404)
        .json({ message: "No journals found for analysis." });
    }

    const plainTextJournals = journals.map((journal) => ({
      _id: journal._id,
      content: decrypt(journal.content, journal.iv, journal.tag),
      analysis: journal.analysis,
      createdAt: journal.createdAt,
    }));

    const combinedContent = plainTextJournals
      .reverse() // so oldest appears first in summary
      .map((j) => `- ${j.content}`)
      .join("\n");

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const prompt = `
You are a kind and empathetic mental health assistant. A user has written 7 journal entries.

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
    const rawSummary = response.text();
    const summary = normalizeSummary(rawSummary);

    res.status(200).json({ summary });
  } catch (error) {
    console.error(" AI Summary Failed:", error.message);
    res.status(500).json({ message: "Failed to generate emotional summary." });
  }
};

const deleteJournal = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJournal = await Journal.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!deletedJournal) {
      return res.status(404).json({ message: "Journal not found." });
    }

    const user = await User.findById(req.userId);

    if (user) {
      const remainingJournals = await Journal.find({ userId: req.userId }).sort(
        {
          createdAt: 1,
        }
      );

      if (remainingJournals.length === 0) {
        user.lastJournalDate = null;
        user.streak = 0;
      } else {
        let streak = 0;
        let lastDate = null;

        for (const journal of remainingJournals) {
          const entryDate = new Date(journal.createdAt);
          entryDate.setHours(0, 0, 0, 0);

          if (!lastDate) {
            streak = 1;
            lastDate = entryDate;
            continue;
          }

          const diffDays = Math.floor(
            (entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 0) {
            // Same day entry → streak unchanged, keep lastDate as earliest occurrence that day
            continue;
          }

          if (diffDays === 1) {
            streak += 1;
          } else {
            streak = 1;
          }

          lastDate = entryDate;
        }

        user.lastJournalDate = lastDate;
        user.streak = streak;
      }

      await user.save();
    }

    res.status(200).json({ message: "Journal deleted successfully." });
  } catch (error) {
    console.log(error.message);

    res
      .status(500)
      .json({ message: "Failed to delete journal", error: error.message });
  }
};

module.exports = {
  createJournal,
  getJournals,
  getSummaryNarrative,
  deleteJournal,
};
