import { Router } from 'express';
import { listarDoacoes, buscarDoacaoPorId, cadastrarDoacao, atualizarDoacao, cancelarDoacao, minhasDoacoes } from '../controllers/doacoesController.js';
import { autenticarToken, permitirNiveis } from '../middleware/auth.js';

const router = Router();
router.use(autenticarToken);
router.get('/', listarDoacoes);
router.get('/minhas', permitirNiveis('doador', 'admin'), minhasDoacoes);
router.get('/:id', buscarDoacaoPorId);
router.post('/', permitirNiveis('doador', 'admin'), cadastrarDoacao);
router.put('/:id', permitirNiveis('doador', 'admin'), atualizarDoacao);
router.delete('/:id', permitirNiveis('doador', 'admin'), cancelarDoacao);
export default router;
