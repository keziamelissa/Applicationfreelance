export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const compteSchema = new Schema(
    {
      userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
      solde: { type: Number, default: 500000 },
      devise: { type: String, default: 'XOF' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
    },
    { collection: 'comptes' }
  );

  // simple update timestamp
  compteSchema.pre('save', function(next){
    this.updatedAt = new Date();
    next();
  });

  return model('Compte', compteSchema);
};
