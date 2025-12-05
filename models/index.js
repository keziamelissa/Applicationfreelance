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
import soumissionFactory from './soumission.js';
import revisionFactory from './revision.js';
import evaluationFactory from './evaluation.js';
import compteFactory from './compte.js';
import escrowFactory from './escrow.js';

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
export const Soumission = soumissionFactory(mongoose);
export const Revision = revisionFactory(mongoose);
export const Evaluation = evaluationFactory(mongoose);
export const Compte = compteFactory(mongoose);
export const Escrow = escrowFactory(mongoose);

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
  Soumission,
  Revision,
  Evaluation,
  Compte,
  Escrow
};
