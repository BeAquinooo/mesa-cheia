import { Router } from 'express';
import { listarDoacoes, buscarDoacaoPorId, cadastrarDoacao } from '../controllers/doacoesController.js';

const router = Router();

// Entrega 2: rotas ainda abertas. Na Entrega 3 entram autenticarToken (JWT) e as permissões por nível:
// GET para qualquer usuário logado; POST/PUT/DELETE somente doador (dono) ou admin.
router.get('/', listarDoacoes);
router.get('/:id', buscarDoacaoPorId);
router.post('/', cadastrarDoacao);

export default router;
