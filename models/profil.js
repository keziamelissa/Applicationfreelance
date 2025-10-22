export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const profilSchema = new Schema({
    idUser: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    tarifHorraire: { type: String },
    role: { type: String, enum: ['client','freelanceur','admin'], required: true },
    portfolio: { type: String },
    disponibilite: { type: String, enum: ['temps_plein','temps_partiel','freelance','indisponible'] },
    moyenneDesNotes: { type: Number, default: 0 },
    nbreDeJobs: { type: Number, default: 0 },
  }, { collection: 'profils' });

  return model('Profil', profilSchema);
};
