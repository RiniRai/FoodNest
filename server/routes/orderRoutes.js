import express from "express";
import {
  placeOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();


//customer
router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);


// Admin Only
router.get("/", authMiddleware, adminMiddleware,getAllOrders);
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;