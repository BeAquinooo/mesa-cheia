import { Router } from 'express';
import { listarCategorias } from '../controllers/categoriasController.js';
import { autenticarToken } from '../middleware/auth.js';
const router = Router();
router.use(autenticarToken);
router.get('/', listarCategorias);
export default router;
