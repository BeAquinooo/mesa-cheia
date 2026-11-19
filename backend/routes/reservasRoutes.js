import { Router } from 'express';
import { autenticarToken, permitirNiveis } from '../middleware/auth.js';
import { reservarDoacao, minhasReservas } from '../controllers/reservasController.js';
const router = Router();
router.use(autenticarToken);
router.get('/minhas', permitirNiveis('instituicao', 'admin'), minhasReservas);
router.post('/:id', permitirNiveis('instituicao'), reservarDoacao);
export default router;
