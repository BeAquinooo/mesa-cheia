import pool from '../database/conexao.js';

export async function reservarDoacao(req, res) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ mensagem: 'ID inválido.' });
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const [doacoes] = await conexao.execute("SELECT id, status FROM doacoes WHERE id = ? FOR UPDATE", [id]);
    if (!doacoes.length) { await conexao.rollback(); return res.status(404).json({ mensagem: 'Doação não encontrada.' }); }
    if (doacoes[0].status !== 'disponivel') { await conexao.rollback(); return res.status(409).json({ mensagem: 'Esta doação não está mais disponível.' }); }
    const [resultado] = await conexao.execute(
      "INSERT INTO reservas (doacao_id, instituicao_id, status) VALUES (?, ?, 'confirmada')",
      [id, req.usuario.id],
    );
    await conexao.execute("UPDATE doacoes SET status = 'reservada' WHERE id = ?", [id]);
    await conexao.commit();
    return res.status(201).json({ mensagem: 'Doação reservada com sucesso.', reserva: { id: resultado.insertId, doacao_id: id, status: 'confirmada' } });
  } catch (e) {
    await conexao.rollback();
    return res.status(500).json({ mensagem: 'Não foi possível reservar a doação.' });
  } finally { conexao.release(); }
}

export async function minhasReservas(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.status AS status_reserva, r.criada_em, d.id AS doacao_id, d.titulo, d.quantidade, d.local_retirada
       FROM reservas r JOIN doacoes d ON d.id = r.doacao_id
       ${req.usuario.nivel === 'admin' ? '' : 'WHERE r.instituicao_id = ?'} ORDER BY r.criada_em DESC`,
      req.usuario.nivel === 'admin' ? [] : [req.usuario.id],
    );
    return res.json(rows);
  } catch { return res.status(500).json({ mensagem: 'Não foi possível listar as reservas.' }); }
}
