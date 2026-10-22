
import Coupon from "../models/Coupon.js";

// Create a coupon (Admin only)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscountAmount,
      minOrderAmount,
      expiryDate,
      isActive = true,
    } = req.body;

    if (
      !code ||
      !discountType ||
      discountValue === undefined ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Code, discount type, discount value and expiry date are required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code cannot be empty",
      });
    }

    if (!["percentage", "flat"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be percentage or flat",
      });
    }

    const value = Number(discountValue);
    const minimum = Number(minOrderAmount ?? 0);
    const expiry = new Date(expiryDate);

    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than zero",
      });
    }

    if (discountType === "percentage" && value > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    if (!Number.isFinite(minimum) || minimum < 0) {
      return res.status(400).json({
        success: false,
        message: "Minimum order amount must be zero or greater",
      });
    }

    if (Number.isNaN(expiry.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid expiry date",
      });
    }

    let maxDiscount = maxDiscountAmount;

    if (
      maxDiscount !== undefined &&
      maxDiscount !== null &&
      maxDiscount !== ""
    ) {
      maxDiscount = Number(maxDiscount);

      if (!Number.isFinite(maxDiscount) || maxDiscount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Maximum discount must be greater than zero",
        });
      }
    } else {
      maxDiscount = null;
    }

    if (discountType === "flat" && maxDiscount !== null) {
      return res.status(400).json({
        success: false,
        message: "Maximum discount amount is only applicable to percentage coupons",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      description: description?.trim() || "",
      discountType,
      discountValue: value,
      maxDiscountAmount: maxDiscount,
      minOrderAmount: minimum,
      expiryDate: expiry,
      isActive,
      createdBy: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
    });
  }
};

// Get all coupons (Admin only)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get all coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
    });
  }
};

// Get active, unexpired coupons (Public API for customers)
export const getPublicCoupons = async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: now },
    })
      .select(
        "code description discountType discountValue maxDiscountAmount minOrderAmount expiryDate"
      )
      .sort({ expiryDate: 1 });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get public coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch available offers",
    });
  }
};

// Update a coupon (Admin only)
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.code !== undefined) {
      if (typeof updates.code !== "string" || !updates.code.trim()) {
        return res.status(400).json({
          success: false,
          message: "Coupon code cannot be empty",
        });
      }

      updates.code = updates.code.trim().toUpperCase();

      const duplicate = await Coupon.findOne({
        code: updates.code,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "A coupon with this code already exists",
        });
      }
    }

    if (
      updates.discountType !== undefined &&
      !["percentage", "flat"].includes(updates.discountType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be percentage or flat",
      });
    }

    if (updates.discountValue !== undefined) {
      updates.discountValue = Number(updates.discountValue);

      if (
        !Number.isFinite(updates.discountValue) ||
        updates.discountValue <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Discount value must be greater than zero",
        });
      }
    }

    const existingCoupon = await Coupon.findById(id);

    if (!existingCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const effectiveType =
      updates.discountType ?? existingCoupon.discountType;
    const effectiveValue =
      updates.discountValue ?? existingCoupon.discountValue;

    if (effectiveType === "percentage" && effectiveValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    if (updates.minOrderAmount !== undefined) {
      updates.minOrderAmount = Number(updates.minOrderAmount);

      if (
        !Number.isFinite(updates.minOrderAmount) ||
        updates.minOrderAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Minimum order amount must be zero or greater",
        });
      }
    }

    if (updates.maxDiscountAmount !== undefined) {
      if (
        updates.maxDiscountAmount === null ||
        updates.maxDiscountAmount === ""
      ) {
        updates.maxDiscountAmount = null;
      } else {
        updates.maxDiscountAmount = Number(updates.maxDiscountAmount);

        if (
          !Number.isFinite(updates.maxDiscountAmount) ||
          updates.maxDiscountAmount <= 0
        ) {
          return res.status(400).json({
            success: false,
            message: "Maximum discount must be greater than zero",
          });
        }
      }
    }

    if (effectiveType === "flat") {
      updates.maxDiscountAmount = null;
    }

    if (updates.expiryDate !== undefined) {
      const expiry = new Date(updates.expiryDate);

      if (Number.isNaN(expiry.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid expiry date",
        });
      }

      updates.expiryDate = expiry;
    }

    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update coupon",
    });
  }
};

// Delete a coupon (Admin only)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
    });
  }
};

// Validate a coupon before checkout (Authenticated customer)
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || orderAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and order amount are required",
      });
    }

    const amount = Number(orderAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be greater than zero",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const coupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is currently inactive",
      });
    }

    if (new Date(coupon.expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    if (amount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (amount * coupon.discountValue) / 100;

      if (
        coupon.maxDiscountAmount !== null &&
        coupon.maxDiscountAmount !== undefined
      ) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon discount configuration",
      });
    }

    discount = Math.round(Math.min(discount, amount) * 100) / 100;

    const finalAmount =
      Math.round((amount - discount) * 100) / 100;

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      orderAmount: amount,
      discount,
      finalAmount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate coupon",
    });
  }
};
