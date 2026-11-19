import { Router } from 'express';
import { listarUsuarios, alterarNivel } from '../controllers/usuariosController.js';
import { autenticarToken, permitirNiveis } from '../middleware/auth.js';
const router = Router();
router.use(autenticarToken, permitirNiveis('admin'));
router.get('/', listarUsuarios);
router.put('/:id/nivel', alterarNivel);
export default router;
