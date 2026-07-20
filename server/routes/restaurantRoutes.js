import express from "express";
import {
    addRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} from "../controllers/restaurantController.js";

const router = express.Router();

router.post("/", addRestaurant);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);

export default router;