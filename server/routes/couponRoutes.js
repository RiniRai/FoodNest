
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getPublicCoupons,
} from "../controllers/couponController.js";

const router = express.Router();

// Customer: Validate a coupon during checkout
router.post("/validate", authMiddleware, validateCoupon);

// Admin: Get all coupons
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllCoupons
);
router.get("/public", getPublicCoupons);
// Admin: Create a coupon
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCoupon
);

// Admin: Update a coupon
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCoupon
);

// Admin: Delete a coupon
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCoupon
);


export default router;
