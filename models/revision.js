export default (mongoose) => {
  const { Schema, model, Types } = mongoose;

  const revisionSchema = new Schema({
    soumissionId: { type: Types.ObjectId, ref: 'Soumission', required: true },
    clientId: { type: Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: Types.ObjectId, ref: 'User', required: true },

    commentaireClient: { type: String, required: true }, // Ce que le client demande de modifier
    reponseFreelancer: { type: String }, // Facultatif : si le freelanceur répond

    statut: {
      type: String,
      enum: ['en_attente', 'corrigée', 'refusée'],
      default: 'en_attente',
    },

    fichiersCorriges: [
      {
        filename: String,
        url: String,
        mimeType: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }, { collection: 'revisions', timestamps: true });

  return model('Revision', revisionSchema);
};
