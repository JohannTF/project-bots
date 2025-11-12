import express from "express";
import { showLogin, showRegister, registerUser, loginUser, logoutUser, userPage } from "../controllers/authController.js";
import { timeProtection } from "../middleware/timeProtection.js";

const router = express.Router();

router.get("/login", showLogin);
router.post("/login", timeProtection, loginUser);

router.get("/register", showRegister);
router.post("/register", timeProtection, registerUser);

router.get("/user", userPage);
router.get("/logout", logoutUser);

export default router;
