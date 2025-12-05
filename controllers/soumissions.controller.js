import { Soumission } from '../models/index.js';
import { list, getOne, createOne, updateOne, deleteOne } from './crudFactory.js';

export const listSoumissions = list(Soumission);
export const getSoumission = getOne(Soumission);
export const createSoumission = createOne(Soumission);
export const updateSoumission = updateOne(Soumission);
export const deleteSoumission = deleteOne(Soumission);

export const createSoumissionWithFiles = async (req, res, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const mappedFiles = files.map((f) => ({
      filename: f.filename,
      url: `/uploads/deliveries/${f.filename}`,
      mimeType: f.mimetype,
      size: f.size,
      storageProvider: 'local',
      checksum: undefined,
      uploadedAt: new Date(),
    }));

    const totalSize = mappedFiles.reduce((sum, f) => sum + (f.size || 0), 0);

    const payload = {
      ...req.body,
      files: mappedFiles,
      metadata: {
        ...(req.body?.metadata || {}),
        totalSize,
        fileCount: mappedFiles.length,
      },
    };

    const row = await Soumission.create(payload);
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
};
