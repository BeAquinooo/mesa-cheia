import './config/ambiente.js';
import express from 'express';
import cors from 'cors';
import doacoesRoutes from './routes/doacoesRoutes.js';
import categoriasRoutes from './routes/categoriasRoutes.js';

const app = express();
app.disable('x-powered-by');
// CORS permite usar o Expo Web (outra porta). Ele não substitui autenticação.
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(function garantirCorpo(req, res, next) {
  // Sem JSON, req.body fica como objeto vazio e a validação responde 400 em vez de quebrar.
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    req.body = {};
  }
  next();
});

app.get('/', function apresentarApi(req, res) {
  res.json({ mensagem: 'API Mesa Cheia', rotas: ['/doacoes', '/categorias'] });
});
app.use('/doacoes', doacoesRoutes);
app.use('/categorias', categoriasRoutes);

app.use(function rotaNaoEncontrada(req, res) {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

// Quatro parâmetros identificam um tratador de erros do Express.
app.use(function tratarErro(erro, req, res, next) {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'JSON inválido no corpo da requisição.' });
  }
  if (erro.type === 'entity.too.large') {
    return res.status(413).json({ mensagem: 'Corpo da requisição muito grande.' });
  }
  // Nunca devolver SQL, credenciais ou stack trace ao cliente.
  return res.status(500).json({ mensagem: 'Erro interno do servidor. Tente novamente.' });
});

export default app;
