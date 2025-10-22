export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const contratSchema = new Schema({
    idTache: { type: Types.ObjectId, ref: 'Tache', required: true },
    idClient: { type: Types.ObjectId, ref: 'User', required: true },
    idFreelanceur: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['fixe','parHeure'], required: true },
    montantConvenu: { type: Number, required: true },
    satuts: { type: String, enum: ['enCours','enPause','termine','annule'], required: true },
    dateDeDebut: { type: Date, required: true },
    dateDeFin: { type: Date },
    dateDeCreation: { type: Date, default: Date.now },
  }, { collection: 'contrats' });

  return model('Contrat', contratSchema);
};
