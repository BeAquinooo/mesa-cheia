import jwt from 'jsonwebtoken';

export function autenticarToken(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Faça login para continuar.' });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ mensagem: 'Sessão inválida ou expirada. Entre novamente.' });
  }
}

export function permitirNiveis(...niveis) {
  return function verificarNivel(req, res, next) {
    if (!req.usuario || !niveis.includes(req.usuario.nivel)) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para esta ação.' });
    }
    return next();
  };
}
