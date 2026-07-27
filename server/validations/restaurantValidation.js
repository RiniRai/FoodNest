import { body, validationResult } from "express-validator";

export const restaurantValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("cuisine")
    .trim()
    .notEmpty()
    .withMessage("Cuisine is required"),

  body("image")
    .isURL()
    .withMessage("Valid image URL is required"),

  body("deliveryTime")
    .trim()
    .notEmpty()
    .withMessage("Delivery time is required"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];