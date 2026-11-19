import './config/ambiente.js';
import express from 'express';
import cors from 'cors';
import doacoesRoutes from './routes/doacoesRoutes.js';
import categoriasRoutes from './routes/categoriasRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';
import reservasRoutes from './routes/reservasRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(function garantirCorpo(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) req.body = {};
  next();
});
app.get('/', (req, res) => res.json({ mensagem: 'API Mesa Cheia', rotas: ['/auth/cadastro', '/auth/login', '/doacoes', '/categorias', '/reservas', '/usuarios'] }));
app.use('/auth', authRoutes);
app.use('/doacoes', doacoesRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/reservas', reservasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use((req, res) => res.status(404).json({ mensagem: 'Rota não encontrada.' }));
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') return res.status(400).json({ mensagem: 'JSON inválido no corpo da requisição.' });
  if (erro.type === 'entity.too.large') return res.status(413).json({ mensagem: 'Corpo da requisição muito grande.' });
  return res.status(500).json({ mensagem: 'Erro interno do servidor. Tente novamente.' });
});
export default app;
