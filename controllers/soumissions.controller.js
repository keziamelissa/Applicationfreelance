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

    // Parse and normalize links from body (can be JSON string or various fields)
    let bodyLinks = req.body?.links;
    try {
      if (typeof bodyLinks === 'string') {
        bodyLinks = JSON.parse(bodyLinks);
      }
    } catch (_) {
      // ignore parse error, will fallback below
    }
    const linksArr = [];
    const push = (v) => { if (v != null) { if (Array.isArray(v)) linksArr.push(...v); else linksArr.push(v); } };
    push(bodyLinks);
    push(req.body?.liens);
    push(req.body?.urls);
    if (req.body?.link) linksArr.push(req.body.link);
    if (req.body?.url) linksArr.push(req.body.url);
    const normalizedLinks = linksArr
      .map((x) => {
        if (typeof x === 'string') return { url: x, label: x };
        const u = x?.url || x?.href || x?.lien || '';
        const l = x?.label || x?.titre || x?.title || u;
        return u ? { url: u, label: l } : null;
      })
      .filter(Boolean);
    // Deduplicate by URL
    const seen = new Set();
    const uniqueLinks = normalizedLinks.filter((it) => {
      const k = it.url;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    const payload = {
      ...req.body,
      files: mappedFiles,
      links: uniqueLinks,
      metadata: {
        ...(req.body?.metadata || {}),
        totalSize,
        fileCount: mappedFiles.length,
      },
      status: req.body?.status || 'submitted',
      deliveredAt: req.body?.deliveredAt || new Date(),
    };

    const row = await Soumission.create(payload);
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
};
