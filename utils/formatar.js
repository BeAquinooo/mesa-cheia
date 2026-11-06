// Funções puras de formatação. A API devolve datas como texto ('2026-11-06' e '2026-11-06 15:00:00'),
// então trabalhamos com o texto direto, sem new Date(), para não sofrer com fuso horário.

export function formatarData(texto) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto || '');
  return partes ? partes[3] + '/' + partes[2] + '/' + partes[1] : '';
}

export function formatarHora(texto) {
  const partes = /[ T](\d{2}):(\d{2})/.exec(texto || '');
  return partes ? partes[1] + ':' + partes[2] : '';
}

// '2026-11-06 15:00:00' + '2026-11-06 16:00:00' → '06/11/2026, 15:00 às 16:00'
export function formatarRetirada(inicio, fim) {
  if (!inicio || !fim) { return ''; }
  if (formatarData(inicio) === formatarData(fim)) {
    return formatarData(inicio) + ', ' + formatarHora(inicio) + ' às ' + formatarHora(fim);
  }
  return formatarData(inicio) + ' ' + formatarHora(inicio) + ' até ' + formatarData(fim) + ' ' + formatarHora(fim);
}

// Data de hoje (fuso do aparelho) no formato AAAA-MM-DD.
export function hojeISO(agora = new Date()) {
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return agora.getFullYear() + '-' + mes + '-' + dia;
}

function diasEntre(deISO, ateISO) {
  const [a1, m1, d1] = deISO.split('-').map(Number);
  const [a2, m2, d2] = ateISO.split('-').map(Number);
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000);
}

// Texto curto para o selo de validade: 'Vence hoje', 'Vence amanhã', 'Vence em 3 dias'...
export function rotuloValidade(validade, hoje = hojeISO()) {
  if (!/^\d{4}-\d{2}-\d{2}/.test(validade || '')) { return ''; }
  const dias = diasEntre(hoje, validade.slice(0, 10));
  if (dias < 0) { return 'Vencida'; }
  if (dias === 0) { return 'Vence hoje'; }
  if (dias === 1) { return 'Vence amanhã'; }
  if (dias <= 7) { return 'Vence em ' + dias + ' dias'; }
  return 'Validade: ' + formatarData(validade);
}
