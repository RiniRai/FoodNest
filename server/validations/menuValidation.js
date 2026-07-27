import { body, validationResult } from "express-validator";

export const menuValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Menu name is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("price")
        .isFloat({ min: 1 })
        .withMessage("Price must be greater than 0"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("image")
        .isURL()
        .withMessage("Valid image URL is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        next();
    }
];