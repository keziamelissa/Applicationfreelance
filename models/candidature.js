export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const candidatureSchema = new Schema({
    idTache: { type: Types.ObjectId, ref: 'Tache', required: true },
    idFreelanceur: { type: Types.ObjectId, ref: 'User', required: true },
    lettreDeMotivation: { type: String },
    budgetProposer: { type: Number },
    status: { type: String, enum: ['accepte','rejete','enAttente','retirer'], default: 'enAttente' },
    dateDeCreation: { type: Date, default: Date.now },
  }, { collection: 'candidatures' });

  return model('Candidature', candidatureSchema);
};
