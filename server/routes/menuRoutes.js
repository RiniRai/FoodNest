import express from "express";
import { addMenuItem } from "../controllers/menuController.js";

const router = express.Router();

router.post("/", addMenuItem);

export default router;