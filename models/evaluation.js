export default (mongoose) => {
  const { Schema, model, Types } = mongoose;

  const evaluationSchema = new Schema(
    {
      contratId: { type: Types.ObjectId, ref: 'Contrat', required: true },
      freelancerId: { type: Types.ObjectId, ref: 'User', required: true },
      clientId: { type: Types.ObjectId, ref: 'User', required: true },

      rating: { type: Number, min: 1, max: 5, required: true },
      commentaire: { type: String },

      createdAt: { type: Date, default: Date.now },
    },
    { collection: 'evaluations' }
  );

  evaluationSchema.index({ contratId: 1, clientId: 1 }, { unique: true });

  return model('Evaluation', evaluationSchema);
};
