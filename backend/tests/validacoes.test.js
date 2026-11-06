import test from 'node:test';
import assert from 'node:assert/strict';
import { dataValida, idValido, normalizarDataHora, validarNovaDoacao } from '../utils/validacoes.js';

const HOJE = '2026-11-06';

function corpoValido(alteracoes = {}) {
  return {
    titulo: 'Marmitas do almoço',
    descricao: 'Arroz, feijão e frango.',
    quantidade: '20 marmitas',
    refeicoes: 20,
    validade: '2026-11-07',
    local_retirada: 'Centro',
    retirada_inicio: '2026-11-06 15:00',
    retirada_fim: '2026-11-06 16:00',
    categoria_id: 1,
    ...alteracoes,
  };
}

test('idValido aceita inteiros positivos e rejeita o resto', () => {
  assert.equal(idValido('5'), true);
  assert.equal(idValido(12), true);
  for (const ruim of ['0', '-1', '1.5', 'abc', '', '1; DROP TABLE doacoes', 99999999999]) {
    assert.equal(idValido(ruim), false, String(ruim));
  }
});

test('dataValida rejeita datas que não existem', () => {
  assert.equal(dataValida('2026-11-06'), true);
  assert.equal(dataValida('2024-02-29'), true);
  assert.equal(dataValida('2026-02-29'), false);
  assert.equal(dataValida('2026-13-01'), false);
  assert.equal(dataValida('06/11/2026'), false);
});

test('normalizarDataHora completa os segundos e aceita T', () => {
  assert.equal(normalizarDataHora('2026-11-06 15:00'), '2026-11-06 15:00:00');
  assert.equal(normalizarDataHora('2026-11-06T15:30:10'), '2026-11-06 15:30:10');
  assert.equal(normalizarDataHora('2026-11-06 25:00'), null);
  assert.equal(normalizarDataHora('2026-11-06 15:61'), null);
  assert.equal(normalizarDataHora('2026-02-30 10:00'), null);
  assert.equal(normalizarDataHora(123), null);
});

test('validarNovaDoacao aceita um corpo completo e limpa os dados', () => {
  const { erro, dados } = validarNovaDoacao(corpoValido({ titulo: '  Marmitas  ', refeicoes: '20' }), HOJE);
  assert.equal(erro, undefined);
  assert.equal(dados.titulo, 'Marmitas');
  assert.equal(dados.refeicoes, 20);
  assert.equal(dados.retirada_inicio, '2026-11-06 15:00:00');
  assert.equal(dados.doador_id, 1);
});

test('validarNovaDoacao respeita o doador_id informado', () => {
  const { dados } = validarNovaDoacao(corpoValido({ doador_id: '2' }), HOJE);
  assert.equal(dados.doador_id, 2);
});

test('validarNovaDoacao rejeita campos obrigatórios ausentes ou inválidos', () => {
  const casos = [
    { titulo: '' },
    { titulo: 'x'.repeat(121) },
    { titulo: 42 },
    { descricao: 'x'.repeat(501) },
    { quantidade: '   ' },
    { refeicoes: -1 },
    { refeicoes: '1.5' },
    { refeicoes: true },
    { refeicoes: undefined },
    { validade: '2026-11-05' },
    { validade: '2026-02-31' },
    { validade: undefined },
    { local_retirada: '' },
    { retirada_inicio: 'amanhã' },
    { retirada_fim: '2026-11-06 14:00' },
    { retirada_fim: '2026-11-06 15:00' },
    { categoria_id: 0 },
    { categoria_id: 'abc' },
    { categoria_id: undefined },
    { doador_id: 'x' },
  ];
  for (const alteracao of casos) {
    const { erro, dados } = validarNovaDoacao(corpoValido(alteracao), HOJE);
    assert.ok(erro, 'deveria rejeitar ' + JSON.stringify(alteracao));
    assert.equal(dados, undefined);
  }
});

test('validarNovaDoacao aceita validade igual a hoje', () => {
  const { erro } = validarNovaDoacao(corpoValido({ validade: HOJE }), HOJE);
  assert.equal(erro, undefined);
});
