import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const enderecoPadrao = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const API = (process.env.EXPO_PUBLIC_API_URL || enderecoPadrao).replace(/\/+$/, '');
const CHAVE_SESSAO = '@mesa-cheia/sessao';
let sessaoAtual = null;

export async function carregarSessao() {
  if (sessaoAtual) return sessaoAtual;
  try { const salvo = await AsyncStorage.getItem(CHAVE_SESSAO); sessaoAtual = salvo ? JSON.parse(salvo) : null; }
  catch { sessaoAtual = null; }
  return sessaoAtual;
}
export async function salvarSessao(sessao) {
  sessaoAtual = sessao;
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}
export async function encerrarSessao() {
  sessaoAtual = null;
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}

async function requisicao(caminho, opcoes = {}) {
  const controle = new AbortController();
  const cronometro = setTimeout(() => controle.abort(), 12000);
  let resposta;
  try {
    const sessao = await carregarSessao();
    resposta = await fetch(API + caminho, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...(sessao?.token ? { Authorization: 'Bearer ' + sessao.token } : {}), ...opcoes.headers },
      signal: controle.signal,
    });
  } catch {
    throw new Error('Não foi possível conectar à API (' + API + '). Confira se o servidor está ligado e o endereço em .env.');
  } finally { clearTimeout(cronometro); }
  let dados = null;
  try { dados = await resposta.json(); } catch {}
  if (!resposta.ok) {
    if (resposta.status === 401 && caminho !== '/auth/login') await encerrarSessao();
    const erro = new Error(dados?.mensagem || 'A API respondeu com erro ' + resposta.status + '.');
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}
export function cadastrarUsuario(dados) { return requisicao('/auth/cadastro', { method: 'POST', body: JSON.stringify(dados) }); }
export async function fazerLogin(dados) {
  const sessao = await requisicao('/auth/login', { method: 'POST', body: JSON.stringify(dados) });
  await salvarSessao(sessao);
  return sessao;
}
export function listarDoacoes() { return requisicao('/doacoes'); }
export function buscarDoacao(id) { return requisicao('/doacoes/' + encodeURIComponent(id)); }
export function cadastrarDoacao(dados) { return requisicao('/doacoes', { method: 'POST', body: JSON.stringify(dados) }); }
export function atualizarDoacao(id, dados) { return requisicao('/doacoes/' + id, { method: 'PUT', body: JSON.stringify(dados) }); }
export function cancelarDoacao(id) { return requisicao('/doacoes/' + id, { method: 'DELETE' }); }
export function listarMinhasDoacoes() { return requisicao('/doacoes/minhas'); }
export function listarCategorias() { return requisicao('/categorias'); }
export function reservarDoacao(id) { return requisicao('/reservas/' + id, { method: 'POST' }); }
export function listarMinhasReservas() { return requisicao('/reservas/minhas'); }
export function listarUsuarios() { return requisicao('/usuarios'); }
export function alterarNivelUsuario(id, nivel) { return requisicao('/usuarios/' + id + '/nivel', { method: 'PUT', body: JSON.stringify({ nivel }) }); }
