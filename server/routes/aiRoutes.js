
import express from "express";
import { chatWithFoodAssistant } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", chatWithFoodAssistant);

export default router;
