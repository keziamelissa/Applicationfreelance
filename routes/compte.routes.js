import { Router } from 'express'
import { protect, authorize } from '../middlewares/auth.middleware.js'
import { Compte } from '../models/index.js'

const router = Router()

// Créditer le compte du user courant (client ou freelance) - pour tests / sandbox
router.post('/credit', protect, async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id
    const { amount } = req.body || {}
    const numeric = Number(amount)
    if (!(numeric > 0)) return res.status(400).json({ message: 'Montant invalide' })

    let compte = await Compte.findOne({ userId })
    if (!compte) compte = new Compte({ userId, solde: 0 })
    compte.solde += numeric
    await compte.save()

    res.status(200).json({ message: 'Compte crédité', solde: compte.solde })
  } catch (e) { next(e) }
})

export default router
