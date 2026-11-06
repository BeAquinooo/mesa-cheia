import test from 'node:test';
import assert from 'node:assert/strict';
import { formatarData, formatarHora, formatarRetirada, hojeISO, rotuloValidade } from '../utils/formatar.js';

test('formatarData e formatarHora leem o texto vindo da API', () => {
  assert.equal(formatarData('2026-11-06'), '06/11/2026');
  assert.equal(formatarData('2026-11-06 15:00:00'), '06/11/2026');
  assert.equal(formatarHora('2026-11-06 15:30:00'), '15:30');
  assert.equal(formatarData(undefined), '');
  assert.equal(formatarHora(null), '');
});

test('formatarRetirada mostra o dia uma vez quando início e fim são no mesmo dia', () => {
  assert.equal(formatarRetirada('2026-11-06 15:00:00', '2026-11-06 16:00:00'), '06/11/2026, 15:00 às 16:00');
  assert.equal(
    formatarRetirada('2026-11-06 22:00:00', '2026-11-07 01:00:00'),
    '06/11/2026 22:00 até 07/11/2026 01:00',
  );
  assert.equal(formatarRetirada(null, null), '');
});

test('hojeISO usa zeros à esquerda', () => {
  assert.equal(hojeISO(new Date(2026, 0, 5)), '2026-01-05');
});

test('rotuloValidade descreve a proximidade do vencimento', () => {
  const hoje = '2026-11-06';
  assert.equal(rotuloValidade('2026-11-06', hoje), 'Vence hoje');
  assert.equal(rotuloValidade('2026-11-07', hoje), 'Vence amanhã');
  assert.equal(rotuloValidade('2026-11-09', hoje), 'Vence em 3 dias');
  assert.equal(rotuloValidade('2026-12-21', hoje), 'Validade: 21/12/2026');
  assert.equal(rotuloValidade('2026-11-05', hoje), 'Vencida');
  assert.equal(rotuloValidade('2026-11-30 00:00:00', '2026-11-29'), 'Vence amanhã');
  assert.equal(rotuloValidade('', hoje), '');
});
