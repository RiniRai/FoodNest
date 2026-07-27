import express from "express";
import {
    addToCart,
    getUserCart,
    updateCartItem,
    removeCartItem
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All Cart Routes are Protected

// Add Item to Cart
router.post("/", authMiddleware, addToCart);

// Get Logged-in User Cart
router.get("/", authMiddleware, getUserCart);

// Update Cart Item Quantity
router.put("/", authMiddleware, updateCartItem);

// Remove Item From Cart
router.delete("/", authMiddleware, removeCartItem);

export default router;