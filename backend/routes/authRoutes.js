import { Router } from 'express';
import { cadastrarUsuario, entrar } from '../controllers/authController.js';
const router = Router();
router.post('/cadastro', cadastrarUsuario);
router.post('/login', entrar);
export default router;
