import express from "express";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
import { adminPage } from "../controllers/adminController.js";

const router = express.Router();

// Rutas de administrador protegidas con autenticación y autorización
router.get("/", isAuthenticated, isAdmin, adminPage);

export default router;
