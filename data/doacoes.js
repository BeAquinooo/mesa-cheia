// Dados de EXEMPLO da Entrega 1. Na Entrega 2 esta lista passa a vir da API (MySQL) via fetch().
export const categorias = ['Todas', 'Refeições', 'Padaria', 'Hortifruti', 'Mercearia'];

export const doacoes = [
  {
    id: 1,
    titulo: 'Marmitas do almoço',
    doador: 'Restaurante Sabor da Vila',
    categoria: 'Refeições',
    quantidade: '25 marmitas',
    refeicoes: 25,
    validade: 'Consumir hoje',
    local: 'Centro',
    retirada: 'Hoje, 15h às 16h',
    descricao: 'Arroz, feijão, frango assado e salada. Sobra de produção do almoço, embalada e mantida refrigerada.',
  },
  {
    id: 2,
    titulo: 'Pães e bolos do dia',
    doador: 'Padaria Pão Quente',
    categoria: 'Padaria',
    quantidade: '3 caixas',
    refeicoes: 30,
    validade: 'Consumir em até 2 dias',
    local: 'Bairro Jardim',
    retirada: 'Hoje, 19h às 20h',
    descricao: 'Pães franceses, de forma e bolos simples produzidos hoje que não foram vendidos.',
  },
  {
    id: 3,
    titulo: 'Frutas e verduras',
    doador: 'Feira Livre da Praça',
    categoria: 'Hortifruti',
    quantidade: '40 kg',
    refeicoes: 80,
    validade: 'Consumir em até 3 dias',
    local: 'Praça Central',
    retirada: 'Sábado, 13h às 14h',
    descricao: 'Bananas, tomates, alface e laranjas. Alguns itens têm aparência fora do padrão, mas estão próprios para consumo.',
  },
  {
    id: 4,
    titulo: 'Arroz, feijão e macarrão',
    doador: 'Mercado Bom Preço',
    categoria: 'Mercearia',
    quantidade: '60 pacotes',
    refeicoes: 120,
    validade: 'Validade em 45 dias',
    local: 'Vila Nova',
    retirada: 'Segunda, 9h às 11h',
    descricao: 'Pacotes com embalagem levemente danificada, produto intacto e dentro da validade.',
  },
  {
    id: 5,
    titulo: 'Sopa e pães de jantar',
    doador: 'Lanchonete da Esquina',
    categoria: 'Refeições',
    quantidade: '15 porções',
    refeicoes: 15,
    validade: 'Consumir hoje',
    local: 'Centro',
    retirada: 'Hoje, 21h às 22h',
    descricao: 'Sopa de legumes com pão. Produzida hoje, mantida quente até a retirada.',
  },
];

export function buscarDoacao(id) {
  return doacoes.find(function porId(d) { return d.id === id; });
}
