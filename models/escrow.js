export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const escrowSchema = new Schema(
    {
      tacheId: { type: Types.ObjectId, ref: 'Tache', required: true },
      clientId: { type: Types.ObjectId, ref: 'User', required: true },
      freelanceId: { type: Types.ObjectId, ref: 'User' },
      montant: { type: Number, required: true },
      statut: { type: String, enum: ['bloqué', 'libéré'], default: 'bloqué' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
    },
    { collection: 'escrows' }
  );

  escrowSchema.pre('save', function(next){
    this.updatedAt = new Date();
    next();
  });

  return model('Escrow', escrowSchema);
};
