import pool from '../database/conexao.js';

export async function listarUsuarios(req, res) {
  try {
    const [usuarios] = await pool.execute('SELECT id, nome, email, nivel, telefone, criado_em FROM usuarios ORDER BY nome');
    return res.json(usuarios);
  } catch { return res.status(500).json({ mensagem: 'Não foi possível listar usuários.' }); }
}

export async function alterarNivel(req, res) {
  const id = Number(req.params.id);
  const { nivel } = req.body || {};
  if (!Number.isSafeInteger(id) || id < 1 || !['doador', 'instituicao', 'admin'].includes(nivel)) {
    return res.status(400).json({ mensagem: 'ID ou nível inválido.' });
  }
  if (id === req.usuario.id) return res.status(400).json({ mensagem: 'Não é permitido alterar o próprio nível.' });
  try {
    const [resultado] = await pool.execute('UPDATE usuarios SET nivel = ? WHERE id = ?', [nivel, id]);
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    return res.json({ mensagem: 'Nível atualizado com sucesso.' });
  } catch { return res.status(500).json({ mensagem: 'Não foi possível atualizar o nível.' }); }
}
