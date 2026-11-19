import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/conexao.js';

const niveisCadastro = ['doador', 'instituicao'];

export async function cadastrarUsuario(req, res) {
  const { nome, email, senha, telefone, nivel = 'doador' } = req.body || {};
  if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 120 ||
      typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof senha !== 'string' || senha.length < 8 || Buffer.byteLength(senha, 'utf8') > 72 ||
      !niveisCadastro.includes(nivel)) {
    return res.status(400).json({ mensagem: 'Informe nome, e-mail válido, senha de 8 a 72 caracteres e um tipo de conta permitido.' });
  }
  try {
    const hash = await bcrypt.hash(senha, 12);
    const [resultado] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, nivel, telefone) VALUES (?, ?, ?, ?, ?)',
      [nome.trim(), email.trim().toLowerCase(), hash, nivel, typeof telefone === 'string' ? telefone.trim().slice(0, 20) : null],
    );
    return res.status(201).json({ mensagem: 'Conta criada com sucesso.', usuario: { id: resultado.insertId, nome: nome.trim(), email: email.trim().toLowerCase(), nivel } });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    return res.status(500).json({ mensagem: 'Não foi possível criar a conta.' });
  }
}

export async function entrar(req, res) {
  const { email, senha } = req.body || {};
  if (typeof email !== 'string' || typeof senha !== 'string') return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
  try {
    const [usuarios] = await pool.execute(
      'SELECT id, nome, email, senha_hash, nivel FROM usuarios WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()],
    );
    const usuario = usuarios[0];
    const senhaCorreta = usuario ? await bcrypt.compare(senha, usuario.senha_hash) : false;
    if (!senhaCorreta) return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, nivel: usuario.nivel },
      process.env.JWT_SECRET,
      { expiresIn: '8h', issuer: 'mesa-cheia-api' },
    );
    return res.status(200).json({ token, tipo: 'Bearer', expiraEm: '8h', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, nivel: usuario.nivel } });
  } catch {
    return res.status(500).json({ mensagem: 'Não foi possível realizar o login.' });
  }
}
