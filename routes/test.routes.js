// routes/test.routes.js
import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// accessible uniquement aux utilisateurs authentifiés
router.get("/private", protect, (req, res) => {
  res.json({ message: "Accès privé OK", user: req.user });
});

// accessible uniquement aux clients
router.get("/client", protect, authorize("client"), (req, res) => {
  res.json({ message: "Accès client OK" });
});

// accessible uniquement aux freelances
router.get("/freelance", protect, authorize("freelanceur"), (req, res) => {
  res.json({ message: "Accès freelance OK" });
});

export default router;
