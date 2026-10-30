# Mesa Cheia — Proposta do Projeto (Entrega 1)

> Aplicativo mobile que conecta quem tem alimento sobrando a quem precisa dele.

## 1. Problema atual identificado

Todos os dias, restaurantes, padarias, mercados e feiras descartam alimentos que ainda estão próprios para consumo, seja por sobra de produção, excesso de estoque ou aparência fora do padrão. Ao mesmo tempo, instituições como cozinhas comunitárias, abrigos, asilos e ONGs têm dificuldade para conseguir alimentos e atender quem precisa.

O problema central **não é a falta de comida, é a falta de conexão**: quem doaria não sabe a quem oferecer, no tempo certo, e quem precisa não sabe o que está disponível perto de si. Como o alimento é perecível, a informação precisa circular rápido, e hoje isso costuma acontecer por conversas soltas em grupos de mensagem, sem organização nem registro.

## 2. Contexto e público afetado

| Quem | Como é afetado |
|---|---|
| **Doadores** (restaurantes, padarias, mercados, feirantes, famílias) | Têm excedentes, querem doar, mas não sabem como organizar a doação nem a quem oferecer. Parte dos alimentos é descartada. |
| **Instituições receptoras** (cozinhas comunitárias, abrigos, ONGs, asilos, escolas) | Dependem de doações irregulares e precisam descobrir o que está disponível e onde buscar. |
| **Pessoas atendidas** (famílias em insegurança alimentar) | São o destino final da ajuda, que chega de forma irregular ou não chega. |
| **Comunidade e meio ambiente** | O alimento descartado vira resíduo, e gera custo ambiental sem ter servido a ninguém. |

## 3. Justificativa

- Segundo dados da ONU divulgados pela imprensa, o mundo desperdiça cerca de **1 bilhão de refeições por dia**, enquanto cerca de **783 milhões de pessoas passam fome**
  ([InfoMoney](https://www.infomoney.com.br/economia/mundo-desperdica-1-bilhao-de-refeicoes-por-dia-enquanto-783-milhoes-passam-fome/)).
- Reportagem sobre dados da ONU aponta que o Brasil descarta cerca de **30% dos alimentos produzidos**
  ([CNN Brasil](https://www.cnnbrasil.com.br/nacional/brasil-descarta-30-dos-alimentos-produzidos-diz-onu/)).
- Uma parte desse desperdício é evitável com **logística simples**: avisar rápido, combinar a retirada e registrar a doação. Isso é algo que um aplicativo faz bem.
- Um app mobile é adequado porque o doador precisa publicar a sobra **no momento em que ela existe** (ex.: no fechamento do restaurante) e a instituição precisa ser avisada **na hora**, direto do celular.

> Os números acima devem ser conferidos nas fontes originais (relatório *Food Waste Index* do PNUMA/UNEP) antes da apresentação.

## 4. Proposta de solução

**Mesa Cheia** é um aplicativo mobile em que:

1. o **doador** publica rapidamente uma oferta de alimento (o quê, quantidade, validade, local e horário de retirada);
2. a **instituição** vê as ofertas disponíveis, escolhe e **reserva** a doação;
3. o doador confirma e as duas partes combinam a retirada;
4. o sistema mantém o **histórico** das doações, para dar transparência e mostrar o impacto (quantas refeições foram salvas).

**Nome e identidade:** *Mesa Cheia* remete à ideia central do projeto: a comida que sobra em uma mesa vai para outra, para que nenhuma fique vazia. A identidade usa **verde** (alimento fresco, cuidado) e **laranja** (calor, acolhimento) sobre fundo creme.

## 5. Tipos de usuário e permissões iniciais

O projeto terá **três níveis**, acima do mínimo de dois exigido.

| Nível | Quem é | Permissões planejadas |
|---|---|---|
| **Doador** | Restaurante, padaria, mercado, feirante, pessoa | Criar, editar e cancelar **suas próprias** ofertas; confirmar a retirada; ver seu histórico |
| **Instituição** | ONG, cozinha comunitária, abrigo | Ver ofertas disponíveis; reservar e cancelar **suas** reservas; ver seu histórico |
| **Administrador** | Equipe do Mesa Cheia | Gerenciar usuários e níveis; aprovar cadastros de instituições; moderar ou remover ofertas |

Regras principais:

- Um doador **não** vê nem altera ofertas de outro doador.
- Uma instituição **não** cria ofertas e **não** altera ofertas dos doadores.
- Somente o administrador gerencia usuários e níveis.
- Todas essas regras serão validadas **no back-end** (Entrega 3). A interface apenas esconde o que o usuário não pode usar.

## 6. Principais funcionalidades

**Entrega 1 (esta etapa): primeira versão navegável, com dados de exemplo**
- Tela de boas-vindas e apresentação do app
- Início com resumo e atalhos
- Lista de doações disponíveis, com filtro por categoria
- Detalhes de uma doação
- Tela "Como funciona"
- Tela de entrada (apenas visual, sem autenticação ainda)

**Entregas seguintes (previstas)**
- Cadastro e login com senha protegida por hash (Entrega 3)
- Autenticação JWT enviada por Bearer Token (Entrega 3)
- CRUD de ofertas de doação (Entregas 2 e 3)
- Reserva de doação pela instituição (Entrega 3)
- Histórico de doações e contador de impacto (Entrega 3 ou 4)
- Painel do administrador (Entrega 3)

## 7. Telas previstas

| # | Tela | Para quem | Entrega |
|---|---|---|---|
| 1 | Boas-vindas | Todos | 1 |
| 2 | Entrar | Todos | 1 (visual) → 3 (real) |
| 3 | Criar conta | Todos | 3 |
| 4 | Início | Logados | 1 |
| 5 | Doações disponíveis | Instituição, Admin | 1 (dados de exemplo) → 2 (API) |
| 6 | Detalhes da doação | Instituição, Admin | 1 |
| 7 | Como funciona | Todos | 1 |
| 8 | Minhas ofertas | Doador | 3 |
| 9 | Nova oferta / Editar oferta | Doador | 3 |
| 10 | Minhas reservas | Instituição | 3 |
| 11 | Gerenciar usuários | Admin | 3 |

## 8. Fluxo inicial de navegação

```
Boas-vindas ──► Entrar ──► Início ──┬──► Doações disponíveis ──► Detalhes da doação
      │                              │
      └──► Como funciona ◄───────────┘
```

- O aplicativo abre em **Boas-vindas**.
- **Entrar** leva ao **Início** (na Entrega 1, sem validar credenciais).
- Do **Início**, o usuário vai a **Doações disponíveis** e, tocando em um cartão, a **Detalhes da doação**.
- **Como funciona** pode ser aberta a partir de Boas-vindas e do Início.
- A partir da Entrega 3, o fluxo se divide em dois: telas **públicas** (Boas-vindas, Entrar, Criar conta) e telas **privadas** (o restante), que dependem do JWT e do nível do usuário.

## 9. Tecnologias

React Native com Expo, React Navigation, API REST com Node.js e Express, MySQL, autenticação JWT com hash de senha, repositório Git.

## 10. Referência técnica

O projeto-modelo *loja-jwt* (usado em aula) serve como **apoio técnico** para autenticação, JWT, níveis de acesso e CRUD. Os domínios são diferentes: aqui as entidades são **ofertas de doação e reservas**, com regras de propriedade por usuário (cada doador só altera as suas ofertas) e três níveis de acesso, o que não existe no modelo.
