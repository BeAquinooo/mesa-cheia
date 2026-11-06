// Comunicação com a API Express usando fetch() (nativo: não precisa de Axios).
// Fluxo: React Native → fetch() → API Express → MySQL.
import { Platform } from 'react-native';

// O endereço muda conforme onde o app roda (veja .env.example):
//  - emulador Android: 10.0.2.2 é o "localhost" do computador;
//  - navegador/iOS simulator: localhost;
//  - celular com Expo Go: defina EXPO_PUBLIC_API_URL com o IP do computador.
const enderecoPadrao = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const API = (process.env.EXPO_PUBLIC_API_URL || enderecoPadrao).replace(/\/+$/, '');

const TEMPO_LIMITE_MS = 10000;

async function requisicao(caminho, opcoes = {}) {
  // AbortController encerra a requisição se a API não responder a tempo.
  const controle = new AbortController();
  const cronometro = setTimeout(function esgotou() { controle.abort(); }, TEMPO_LIMITE_MS);

  let resposta;
  try {
    resposta = await fetch(API + caminho, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...opcoes.headers },
      signal: controle.signal,
    });
  } catch {
    throw new Error('Não foi possível conectar à API (' + API + '). Ela está ligada? Confira o endereço em .env.');
  } finally {
    clearTimeout(cronometro);
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch {
    // Corpo vazio ou que não é JSON: tratado abaixo conforme o status.
  }

  if (!resposta.ok) {
    const erro = new Error(dados?.mensagem || 'A API respondeu com erro ' + resposta.status + '.');
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

export function listarDoacoes() {
  return requisicao('/doacoes');
}

export function buscarDoacao(id) {
  return requisicao('/doacoes/' + encodeURIComponent(id));
}

export function cadastrarDoacao(dados) {
  return requisicao('/doacoes', { method: 'POST', body: JSON.stringify(dados) });
}

export function listarCategorias() {
  return requisicao('/categorias');
}
