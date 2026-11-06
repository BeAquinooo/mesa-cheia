import pool from '../database/conexao.js';
import { idValido, validarNovaDoacao } from '../utils/validacoes.js';

// A mesma consulta serve para listar e para buscar uma doação: junta categoria e doador.
const SELECT_DOACAO = `
  SELECT d.id, d.titulo, d.descricao, d.quantidade, d.refeicoes, d.validade,
         d.local_retirada, d.retirada_inicio, d.retirada_fim, d.status, d.criado_em,
         d.categoria_id, c.nome AS categoria,
         d.doador_id, u.nome AS doador
  FROM doacoes d
  JOIN categorias c ON c.id = d.categoria_id
  JOIN usuarios u ON u.id = d.doador_id`;

// GET /doacoes  → doações disponíveis e dentro da validade (opcional: ?categoria_id=2)
export async function listarDoacoes(req, res) {
  const filtros = ["d.status = 'disponivel'", 'd.validade >= CURDATE()'];
  const parametros = [];

  if (req.query.categoria_id !== undefined) {
    if (!idValido(req.query.categoria_id)) {
      return res.status(400).json({ mensagem: 'categoria_id inválido.' });
    }
    filtros.push('d.categoria_id = ?');
    parametros.push(Number(req.query.categoria_id));
  }

  try {
    // Os valores externos entram em parâmetros "?", nunca concatenados no SQL.
    const [doacoes] = await pool.execute(
      SELECT_DOACAO + ' WHERE ' + filtros.join(' AND ') + ' ORDER BY d.retirada_inicio ASC, d.id DESC',
      parametros,
    );
    return res.status(200).json(doacoes);
  } catch {
    return res.status(500).json({ mensagem: 'Não foi possível listar as doações.' });
  }
}

// GET /doacoes/:id
export async function buscarDoacaoPorId(req, res) {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ mensagem: 'ID da doação inválido.' });
  }

  try {
    const [doacoes] = await pool.execute(SELECT_DOACAO + ' WHERE d.id = ?', [Number(req.params.id)]);
    if (doacoes.length === 0) {
      return res.status(404).json({ mensagem: 'Doação não encontrada.' });
    }
    return res.status(200).json(doacoes[0]);
  } catch {
    return res.status(500).json({ mensagem: 'Não foi possível buscar a doação.' });
  }
}

// POST /doacoes
export async function cadastrarDoacao(req, res) {
  const { erro, dados } = validarNovaDoacao(req.body);
  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  try {
    const [resultado] = await pool.execute(
      `INSERT INTO doacoes
         (doador_id, categoria_id, titulo, descricao, quantidade, refeicoes, validade, local_retirada, retirada_inicio, retirada_fim)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [dados.doador_id, dados.categoria_id, dados.titulo, dados.descricao, dados.quantidade, dados.refeicoes,
        dados.validade, dados.local_retirada, dados.retirada_inicio, dados.retirada_fim],
    );
    return res.status(201).json({
      mensagem: 'Doação cadastrada com sucesso.',
      doacao: { id: resultado.insertId, ...dados, status: 'disponivel' },
    });
  } catch (erroBanco) {
    // 1452 = chave estrangeira inexistente (categoria ou doador não existe).
    if (erroBanco.errno === 1452) {
      return res.status(400).json({ mensagem: 'Categoria ou doador não encontrado.' });
    }
    return res.status(500).json({ mensagem: 'Não foi possível cadastrar a doação.' });
  }
}
