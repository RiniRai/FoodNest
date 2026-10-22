import express from "express";

import {
    addMenuItem,
    getAllMenuItems,
    getMenuByRestaurant,
    updateMenuItem,
    deleteMenuItem,
    getActiveOffers
} from "../controllers/menuController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { menuValidation } from "../validations/menuValidation.js";

const router = express.Router();

// Public
router.get("/", getAllMenuItems);
router.get("/restaurant/:restaurantId", getMenuByRestaurant);

// Admin Only
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    menuValidation,
    addMenuItem
);
router.put("/:id", authMiddleware, adminMiddleware, updateMenuItem);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMenuItem);
router.get("/offers", getActiveOffers);

export default router;