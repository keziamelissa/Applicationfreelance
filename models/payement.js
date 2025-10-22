export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const payementSchema = new Schema({
    idContrat: { type: Types.ObjectId, ref: 'Contrat', required: true },
    montantPayé: { type: Number, required: true },
    methodeDePayement: { type: String, enum: ['bank'], required: true },
    status: { type: String, enum: ['enCours','termine','echoue'], required: true },
    dateDeTransaction: { type: Date, default: Date.now },
  }, { collection: 'payements' });

  return model('Payement', payementSchema);
};
