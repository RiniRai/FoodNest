
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    // Percentage: 1–100
    // Flat: discount amount in rupees
    discountValue: {
      type: Number,
      required: true,
      min: 0.01,
      validate: {
        validator: function (value) {
          if (this.discountType === "percentage") {
            return value <= 100;
          }

          return true;
        },
        message: "Percentage discount cannot exceed 100%",
      },
    },

    // Maximum discount allowed for percentage coupons.
    // Example: 20% off, maximum ₹150.
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: 0,
      validate: {
        validator: function (value) {
          if (this.discountType === "flat") {
            return value === null || value === undefined;
          }

          return value === null || value === undefined || value > 0;
        },
        message: "Maximum discount must be greater than zero",
      },
    },

    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
