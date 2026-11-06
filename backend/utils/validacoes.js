// Validação no servidor: qualquer pessoa pode chamar a API sem passar pelo aplicativo.

export function idValido(id) {
  return /^\d+$/.test(String(id)) && Number.isSafeInteger(Number(id)) && Number(id) > 0 && Number(id) <= 2147483647;
}

// Data de hoje no formato AAAA-MM-DD (fuso do servidor).
export function hojeISO(agora = new Date()) {
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return agora.getFullYear() + '-' + mes + '-' + dia;
}

// Aceita só datas que existem de verdade (rejeita 2026-02-31).
export function dataValida(texto) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!partes) { return false; }
  const [ano, mes, dia] = [Number(partes[1]), Number(partes[2]), Number(partes[3])];
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

// Aceita 'AAAA-MM-DD HH:MM' ou 'AAAA-MM-DD HH:MM:SS' (também com 'T') e devolve 'AAAA-MM-DD HH:MM:SS'.
export function normalizarDataHora(texto) {
  if (typeof texto !== 'string') { return null; }
  const partes = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(texto.trim());
  if (!partes || !dataValida(partes[1])) { return null; }
  const [hora, minuto, segundo] = [Number(partes[2]), Number(partes[3]), Number(partes[4] || 0)];
  if (hora > 23 || minuto > 59 || segundo > 59) { return null; }
  return partes[1] + ' ' + partes[2] + ':' + partes[3] + ':' + String(segundo).padStart(2, '0');
}

function textoEntre(valor, minimo, maximo) {
  return typeof valor === 'string' && valor.trim().length >= minimo && valor.trim().length <= maximo;
}

// Valida o corpo do POST /doacoes. Devolve { erro } ou { dados } já limpos e prontos para o SQL.
export function validarNovaDoacao(corpo, hoje = hojeISO()) {
  if (!textoEntre(corpo.titulo, 1, 120)) {
    return { erro: 'Informe um título com até 120 caracteres.' };
  }
  if (corpo.descricao !== undefined && !textoEntre(corpo.descricao, 0, 500)) {
    return { erro: 'A descrição deve ter até 500 caracteres.' };
  }
  if (!textoEntre(corpo.quantidade, 1, 60)) {
    return { erro: 'Informe a quantidade (ex.: "20 marmitas"), com até 60 caracteres.' };
  }

  // Aceita número ou texto numérico, mas só inteiros de 0 a 100000.
  const refeicoesTexto = String(corpo.refeicoes);
  if (!['number', 'string'].includes(typeof corpo.refeicoes) || !/^\d+$/.test(refeicoesTexto) || Number(refeicoesTexto) > 100000) {
    return { erro: 'Informe o número de refeições como inteiro de 0 a 100000.' };
  }

  if (typeof corpo.validade !== 'string' || !dataValida(corpo.validade)) {
    return { erro: 'Informe a validade no formato AAAA-MM-DD.' };
  }
  if (corpo.validade < hoje) {
    return { erro: 'A validade não pode estar no passado.' };
  }

  if (!textoEntre(corpo.local_retirada, 1, 120)) {
    return { erro: 'Informe o local de retirada com até 120 caracteres.' };
  }

  const inicio = normalizarDataHora(corpo.retirada_inicio);
  const fim = normalizarDataHora(corpo.retirada_fim);
  if (!inicio || !fim) {
    return { erro: 'Informe o início e o fim da retirada no formato AAAA-MM-DD HH:MM.' };
  }
  if (fim <= inicio) {
    return { erro: 'O fim da retirada deve ser depois do início.' };
  }

  if (!idValido(corpo.categoria_id)) {
    return { erro: 'Escolha uma categoria válida.' };
  }
  // TEMPORÁRIO (Entrega 2): ainda não há login, então o doador pode vir no corpo.
  // Na Entrega 3 este valor sai do JWT (req.usuario.id), nunca do corpo da requisição.
  if (corpo.doador_id !== undefined && !idValido(corpo.doador_id)) {
    return { erro: 'doador_id inválido.' };
  }

  return {
    dados: {
      titulo: corpo.titulo.trim(),
      descricao: (corpo.descricao || '').trim(),
      quantidade: corpo.quantidade.trim(),
      refeicoes: Number(refeicoesTexto),
      validade: corpo.validade,
      local_retirada: corpo.local_retirada.trim(),
      retirada_inicio: inicio,
      retirada_fim: fim,
      categoria_id: Number(corpo.categoria_id),
      doador_id: corpo.doador_id === undefined ? 1 : Number(corpo.doador_id),
    },
  };
}
