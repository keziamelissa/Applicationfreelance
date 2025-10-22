import mongoose from 'mongoose';

// Model factories (Mongoose schema creators)
import userFactory from './user.js';
import profilFactory from './profil.js';
import tacheFactory from './tache.js';
import candidatureFactory from './candidature.js';
import contratFactory from './contrat.js';
import payementFactory from './payement.js';
import notificationFactory from './notification.js';
import competenceFactory from './competence.js';
import competenceUtilisateursFactory from './competenceUtilisateurs.js';

// Build models
export const User = userFactory(mongoose);
export const Profil = profilFactory(mongoose);
export const Tache = tacheFactory(mongoose);
export const Candidature = candidatureFactory(mongoose);
export const Contrat = contratFactory(mongoose);
export const Payement = payementFactory(mongoose);
export const Notification = notificationFactory(mongoose);
export const Competence = competenceFactory(mongoose);
export const CompetenceUtilisateurs = competenceUtilisateursFactory(mongoose);

export default {
  User,
  Profil,
  Tache,
  Candidature,
  Contrat,
  Payement,
  Notification,
  Competence,
  CompetenceUtilisateurs,
};
