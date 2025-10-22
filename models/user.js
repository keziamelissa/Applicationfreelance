import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  motDePass: { type: String, required: true },
  role: { type: String, enum: ["client", "freelancer", "admin"], required: true },
  profile_photo: { type: String },
  description: { type: String },
  localisation: { type: String },
  dateDeCreation: { type: Date, default: Date.now },
  dateDeMiseAJour: { type: Date },
});

// Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("motDePass")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePass = await bcrypt.hash(this.motDePass, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Comparaison de mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.motDePass);
};

// ✅ Export par défaut
export default mongoose.model("User", userSchema);
