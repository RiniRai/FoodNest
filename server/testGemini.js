
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey,
  vertexai: false,
});

for (const model of [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
]) {
  try {
    console.log(`Testing ${model}...`);

    const result = await ai.models.generateContent({
      model,
      contents: "Reply with: FoodNest AI is working!",
      config: {
        maxOutputTokens: 30,
      },
    });

    console.log(`${model} response:`, result.text);
  } catch (error) {
    console.error(`${model} failed:`, error.message || error);
  }
}
