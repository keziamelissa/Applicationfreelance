import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
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
import cors from 'cors'; // ✅ ajoute cette lign

const app = express();
app.use(express.json());

// ✅ Active CORS avant les routes
app.use(cors({
  origin: 'http://localhost:62999', // ou le port de ton front (change-le si besoin)
  credentials: true,
}));

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

// Not found
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully to "freelance" database');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
})();
