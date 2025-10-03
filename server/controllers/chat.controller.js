const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1",
});

const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message)
    return res.status(400).json({ message: "Message is required." });

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a kind and empathetic mental health chatbot named Mindlog.
Always be gentle, supportive, and never offer medical advice.
Keep responses short and calming.

User message:
${message}
              `.trim(),
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const reply = response.text();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ message: "Something went wrong with Gemini." });
  }
};

module.exports = { chatWithAI };
