import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createReview,
  getMenuReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Public: Get reviews for a food item
router.get("/:menuItemId", getMenuReviews);

// Protected: Add or update a review
router.post("/", authMiddleware, createReview);

// Protected: Delete your own review
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;