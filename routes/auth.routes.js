// routes/auth.routes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Register (inscription)
router.post("/register", async (req, res) => {
  try {
    const { nom, prenom, email, motDePass, role, localisation, description } = req.body;
    if (!nom || !prenom || !email || !motDePass || !role) {
      return res.status(400).json({ message: "Champs manquants" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email déjà utilisé" });

    const user = new User({ nom, prenom, email, motDePass, role, localisation, description });
    await user.save();

    // On peut ne pas renvoyer le mot de passe
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({ user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

// Login (connexion)
router.post("/login", async (req, res) => {
  try {
    const { email, motDePass } = req.body;
    if (!email || !motDePass) return res.status(400).json({ message: "Email et motDePass requis" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    const isMatch = await user.comparePassword(motDePass);
    if (!isMatch) return res.status(401).json({ message: "Identifiants invalides" });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
});

export default router;
