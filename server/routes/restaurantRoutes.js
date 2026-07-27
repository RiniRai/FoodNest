import express from "express";

import {
    addRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} from "../controllers/restaurantController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { restaurantValidation } from "../validations/restaurantValidation.js";

const router = express.Router();

// Public Routes
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

// Admin Only Routes
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    restaurantValidation,
    addRestaurant
);
router.put("/:id", authMiddleware, adminMiddleware, updateRestaurant);
router.delete("/:id", authMiddleware, adminMiddleware, deleteRestaurant);

export default router;