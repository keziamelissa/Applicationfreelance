import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import profilsRoutes from './routes/profils.routes.js';
import tachesRoutes from './routes/taches.routes.js';
import candidaturesRoutes from './routes/candidatures.routes.js';
import contratsRoutes from './routes/contrats.routes.js';
import payementsRoutes from './routes/payements.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import competencesRoutes from './routes/competences.routes.js';
import competencesUtilisateursRoutes from './routes/competencesUtilisateurs.routes.js';
import testRoutes from './routes/test.routes.js';
import soumissionsRoutes from './routes/soumissions.routes.js';
import revisionsRoutes from './routes/revisions.routes.js';
import evaluationsRoutes from './routes/evaluations.routes.js';

const app = express();
app.use(express.json());

// CORS POUR LE FRONTEND
app.use(cors({
  origin: (origin, callback) => {
    const allowed = ['http://localhost:5173', 'http://localhost:3000'];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Static serving for uploads
const uploadsRoot = path.resolve('uploads');
fs.mkdirSync(uploadsRoot, { recursive: true });
app.use('/uploads', express.static(uploadsRoot));

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/profils', profilsRoutes);
app.use('/api/taches', tachesRoutes);
app.use('/api/candidatures', candidaturesRoutes);
app.use('/api/contrats', contratsRoutes);
app.use('/api/payements', payementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/competences', competencesRoutes);
app.use('/api/competences-utilisateurs', competencesUtilisateursRoutes);
app.use('/api/soumissions', soumissionsRoutes);
app.use('/api/revisions', revisionsRoutes);
app.use('/api/evaluations', evaluationsRoutes);

// Not found
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
})();
