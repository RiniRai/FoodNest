import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
} from "../controllers/authController.js";
import {
    registerValidation,
    loginValidation
} from "../validations/authValidation.js";

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    registerUser
);

router.post(
    "/login",
    loginValidation,
    loginUser
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.put("/reset-password/:token", resetPassword);
router.get("/users", getAllUsers);

export default router;