const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1",
});

const analyzeJournal = async (content) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const prompt = `
You are an emotion analysis assistant.
Analyze the following journal entry and respond with ONLY a valid JSON object like this:

{
  "sentiment": "positive" | "negative" | "neutral",
  "emotions": ["emotion1", "emotion2"],
  "suggestions": ["tip1", "tip2"]
}

Do NOT add any explanation, markdown, or extra text. Only return pure JSON.

Journal Entry:
"${content.trim()}"
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
    const text = response.text();

    // Extract the first JSON object from the response using regex
    const jsonMatch = text.match(/{[\s\S]*?}/);
    if (!jsonMatch) throw new Error("No valid JSON found in response.");

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;

  } catch (error) {
    console.error("❌ Gemini Analysis Failed:", error.message);
    return {
      sentiment: "neutral",
      emotions: [],
      suggestions: ["Could not analyze due to AI error."],
    };
  }
};

module.exports = analyzeJournal;
