
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API key missing. Check your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: "Reply with exactly: API connection successful"
  });

  console.log("Model response:", response.text);
}

main().catch((error) => {
  console.error("API test failed:", error.message);
});
