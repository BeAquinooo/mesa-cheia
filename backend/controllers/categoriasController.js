import pool from '../database/conexao.js';

// GET /categorias
export async function listarCategorias(req, res) {
  try {
    const [categorias] = await pool.execute('SELECT id, nome FROM categorias ORDER BY id');
    return res.status(200).json(categorias);
  } catch {
    return res.status(500).json({ mensagem: 'Não foi possível listar as categorias.' });
  }
}
