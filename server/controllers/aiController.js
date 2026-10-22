
import { GoogleGenAI } from "@google/genai";
import Menu from "../models/Menu.js";

let cachedMenu = null;
let menuCacheTime = 0;

const MENU_CACHE_DURATION = 60 * 1000;
const GEMINI_TIMEOUT = 15000;

const getAvailableMenu = async () => {
  const now = Date.now();

  if (cachedMenu && now - menuCacheTime < MENU_CACHE_DURATION) {
    return cachedMenu;
  }

  const items = await Menu.find({ isAvailable: true })
    .select("name description price category restaurantId")
    .populate("restaurantId", "name cuisine")
    .limit(60)
    .lean()
    .maxTimeMS(5000);

  const menu = items.map((item) => ({
    name: item.name,
    description: item.description || "",
    price: item.price,
    category: item.category,
    restaurant: item.restaurantId?.name || "FoodNest Restaurant",
    cuisine: item.restaurantId?.cuisine || "",
  }));

  cachedMenu = menu;
  menuCacheTime = now;

  return cachedMenu;
};

const generateWithTimeout = async (ai, model, prompt) => {
  let timeoutId;

  try {
    return await Promise.race([
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 120,
        },
      }),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Gemini request timed out after 15 seconds."));
        }, GEMINI_TIMEOUT);
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const chatWithFoodAssistant = async (req, res) => {
  try {
    const { message } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Your message is too long.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from server environment.");

      return res.status(500).json({
        success: false,
        message: "AI configuration is missing on the server.",
      });
    }

    console.log("FoodNest AI: Loading menu...");

    const menu = await getAvailableMenu();

    if (!menu.length) {
      return res.status(200).json({
        success: true,
        reply: "Sorry, there are no available menu items right now.",
      });
    }

    // Use the Gemini Developer API key, not Vertex AI credentials.
    const ai = new GoogleGenAI({
  apiKey: apiKey,
  vertexai: false,
});

    const prompt = `
You are the FoodNest food assistant.
Recommend only items present in the supplied menu.
Never invent dish names, restaurants, or prices.
Respect the customer's budget and food preferences.
If no item matches, explain that politely.
Keep your answer concise, under 60 words.

MENU:
${JSON.stringify(menu)}

CUSTOMER MESSAGE:
${message.trim()}
`;

    // Try the primary model, then a fallback if the failure is temporary.
    const models = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
    ];

    let response;
    let lastError;

    for (const model of models) {
      try {
        console.log(`FoodNest AI: Trying ${model}...`);

        response = await generateWithTimeout(ai, model, prompt);
        break;
      } catch (error) {
        lastError = error;

        const errorText = String(error.message || error);

        console.error(
          `FoodNest AI: ${model} failed:`,
          errorText
        );

        const temporaryFailure =
          errorText.includes("503") ||
          errorText.includes("UNAVAILABLE") ||
          errorText.includes("429") ||
          errorText.includes("RESOURCE_EXHAUSTED") ||
          errorText.includes("timed out");

        // Don't retry invalid credentials or unsupported configurations.
        if (!temporaryFailure) {
          break;
        }
      }
    }

    if (!response) {
      throw lastError || new Error("No Gemini model responded.");
    }

    const reply = response.text?.trim();

    console.log("FoodNest AI: Response received.");

    return res.status(200).json({
      success: true,
      reply:
        reply ||
        "Sorry, I couldn't generate a recommendation. Please try again.",
    });
  } catch (error) {
    const errorText = String(error.message || error);

    console.error("FoodNest AI Assistant error:", errorText);

    const timedOut = errorText.includes("timed out");

    return res.status(timedOut ? 504 : 503).json({
      success: false,
      message: timedOut
        ? "The AI response took too long. Please try again."
        : "The AI assistant is temporarily unavailable. Please try again.",
    });
  }
};
