// Simple CRUD factory for Mongoose models
const isCastError = (err) => err?.name === 'CastError' && err?.kind === 'ObjectId';

export const list = (Model) => async (_req, res, next) => {
  try {
    const rows = await Model.find();
    res.json(rows);
  } catch (e) { next(e); }
};

export const getOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await Model.findById(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) {
    if (isCastError(e)) return res.status(400).json({ error: 'Invalid id' });
    next(e);
  }
};

export const createOne = (Model) => async (req, res, next) => {
  try {
    const row = await Model.create(req.body);
    res.status(201).json(row);
  } catch (e) { next(e); }
};

export const updateOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) {
    if (isCastError(e)) return res.status(400).json({ error: 'Invalid id' });
    next(e);
  }
};

export const deleteOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await Model.findByIdAndDelete(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) {
    if (isCastError(e)) return res.status(400).json({ error: 'Invalid id' });
    next(e);
  }
};
