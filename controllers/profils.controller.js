import { Profil } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listProfils = list(Profil);
export const getProfil = getOne(Profil);
export const createProfil = createOne(Profil);
export const updateProfil = updateOne(Profil);
export const deleteProfil = deleteOne(Profil);

// Get profile by user id
export const getProfilByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const profil = await Profil.findOne({ idUser: userId });
    if (!profil) return res.status(404).json({ error: 'Profil not found' });
    return res.json(profil);
  } catch (err) { next(err); }
};

// Upload CV and store path in 'portfolio'
export const uploadProfilCV = async (req, res, next) => {
  try {
    const { id } = req.params; // profil id
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/cvs/${req.file.filename}`;
    const updated = await Profil.findByIdAndUpdate(id, { portfolio: fileUrl }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Profil not found' });
    res.json({ message: 'CV uploaded', profil: updated });
  } catch (err) { next(err); }
};

// Create or update a profile by user id (upsert) to avoid duplicate key errors on idUser
export const upsertProfilByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body || {};
    const normalizedRole = (req.body?.role === 'freelancer' || req.body?.role === 'freelance' || req.body?.role === 'freelanceur') ? 'freelanceur' : (req.body?.role || undefined);

    const doc = await Profil.findOneAndUpdate(
      { idUser: userId },
      {
        $set: { ...updates, ...(normalizedRole ? { role: normalizedRole } : {}) },
        $setOnInsert: {
          idUser: userId,
          title: updates.title || 'Profil',
          role: normalizedRole || 'client'
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) { next(err); }
};
