export default (mongoose) => {
  const { Schema, model, Types } = mongoose;

  const fileSchema = new Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number },
    storageProvider: { type: String },
    checksum: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  }, { _id: false });

  const linkSchema = new Schema({
    url: { type: String, required: true },
    label: { type: String },
  }, { _id: false });

  const metadataSchema = new Schema({
    totalSize: { type: Number },
    fileCount: { type: Number },
    tags: [{ type: String }],
    globalChecksum: { type: String },
  }, { _id: false });

  const soumissionSchema = new Schema({
    taskId: { type: Types.ObjectId, ref: 'Tache', required: true },
    freelancerId: { type: Types.ObjectId, ref: 'User', required: true },
    clientId: { type: Types.ObjectId, ref: 'User' },

    title: { type: String, required: true },
    description: { type: String },

    files: [fileSchema],
    links: [linkSchema],

    status: { type: String, enum: ['submitted', 'in_review', 'accepted', 'revision_requested', 'rejected'], default: 'submitted' },

    version: { type: Number, default: 1 },
    revisionCount: { type: Number, default: 0 },

    visibility: { type: String, enum: ['private', 'shared'], default: 'private' },

    notesClient: { type: String },

    deliveredAt: { type: Date },

    metadata: metadataSchema,
  }, { collection: 'soumissions', timestamps: true });

  return model('Soumission', soumissionSchema);
};
