import express from "express";
import { signin, signup, google } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/google", google);
export default router;
