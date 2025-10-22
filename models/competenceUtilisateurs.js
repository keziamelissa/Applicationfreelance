export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const cuSchema = new Schema({
    idUser: { type: Types.ObjectId, ref: 'User', required: true },
    idCompetence: { type: Types.ObjectId, ref: 'Competence', required: true },
  }, { collection: 'competence_utilisateurs' });

  cuSchema.index({ idUser: 1, idCompetence: 1 }, { unique: true });

  return model('CompetenceUtilisateurs', cuSchema);
};
