// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Non autorisé, token manquant" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Optional: récupérer l'utilisateur complet si besoin
    const user = await User.findById(decoded.id).select("-motDePass");
    if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });
    req.user = user; // injecte l'utilisateur dans la requête
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour vérifier le rôle
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Non authentifié" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  };
};
