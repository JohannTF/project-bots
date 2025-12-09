import express from "express";
import { showLogin, showRegister, registerUser, loginUser, logoutUser, userPage } from "../controllers/authController.js";
import { timeProtection } from "../middleware/timeProtection.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta raíz - redirige al login
router.get("/", (req, res) => {
  if (req.session.user) {
    // Si ya está autenticado, redirigir según su rol
    if (req.session.user.role === "admin") {
      return res.redirect("/admin");
    }
    return res.redirect("/user");
  }
  res.redirect("/login");
});

router.get("/login", showLogin);
router.post("/login", timeProtection, loginUser);

router.get("/register", showRegister);
router.post("/register", timeProtection, registerUser);

router.get("/user", isAuthenticated, userPage);
router.get("/logout", logoutUser);

export default router;
