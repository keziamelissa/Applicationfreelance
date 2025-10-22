export default (mongoose) => {
  const { Schema, model } = mongoose;
  const competenceSchema = new Schema({
    name: { type: String, required: true, unique: true, index: true },
  }, { collection: 'competences' });

  return model('Competence', competenceSchema);
};
