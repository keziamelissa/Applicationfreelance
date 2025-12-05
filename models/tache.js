export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const tacheSchema = new Schema({
    idClient: { type: Types.ObjectId, ref: 'User', required: true },
    titre: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    type: { type: String, enum: ['fixe','parHeure'], required: true },
    duree: { type: String, required: true },
    status: { type: String, enum: ['ouvert','enCours','termine','annule'], required: true },
    freelanceId: { type: Types.ObjectId, ref: 'User' },
    dateDeCreation: { type: Date, default: Date.now },
    dateDeMiseAJour: { type: Date },
    competences: { type: [String] },
  }, { collection: 'taches' });

  return model('Tache', tacheSchema);
};
