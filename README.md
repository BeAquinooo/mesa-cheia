# Mesa Cheia

> Comida que sobra aqui, mesa cheia ali.

Aplicativo mobile que conecta **quem tem alimento sobrando** (restaurantes, padarias, mercados, feirantes) a **quem pode aproveitá-lo** (ONGs, cozinhas comunitárias, abrigos), reduzindo o desperdício e ajudando a combater a fome.

Projeto avaliativo: *Aplicação Mobile com JWT e Níveis de Usuário*, desenvolvido em 4 entregas.

## Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/PROPOSTA.md`](docs/PROPOSTA.md) | Entrega 1: problema, público, justificativa, solução, usuários, telas e fluxo |
| [`docs/ENTREGA_2.md`](docs/ENTREGA_2.md) | Entrega 2: requisitos, banco de dados (ER e dicionário), rotas da API e permissões |
| [`database/mesa_cheia.sql`](database/mesa_cheia.sql) | Script MySQL: tabelas e dados de exemplo |

## Status das entregas

| Entrega | Conteúdo | Status |
|---|---|---|
| 1 | Proposta e estrutura inicial (Expo, navegação, telas) | ✅ |
| 2 | Modelagem, MySQL, API Express e primeira integração com `fetch()` | ✅ Esta versão |
| 3 | Cadastro, login, hash, JWT, níveis, rotas protegidas e CRUD completo | ⏳ |
| 4 | Testes, APK final e apresentação | ⏳ |

## O que existe até a Entrega 2

- App **React Native (Expo)** com **React Navigation**: 7 telas
- **API REST** em Node.js + Express, organizada em rotas, controllers e conexão com o banco
- Banco **MySQL** com 4 tabelas: `usuarios`, `categorias`, `doacoes`, `reservas`
- Integração `React Native → fetch() → API → MySQL` para a entidade principal:
  - `GET /doacoes`, `GET /doacoes/:id`, `GET /categorias`
  - `POST /doacoes` (tela **Publicar doação**)
- Validação de entrada no servidor, consultas SQL parametrizadas e mensagens de erro sem detalhes internos
- O app mostra carregamento e erro quando a API está fora do ar

**Ainda não existe** (Entrega 3): login, JWT e permissões. A tela **Entrar** é só visual, e as rotas da API ainda estão abertas.

## Estrutura de pastas

```
mesa-cheia/
├── App.js, index.js, app.json
├── assets/                     # ícones e splash
├── components/ui.js            # Botao, Cartao, Selo, Campo, Carregando, Erro...
├── constants/tema.js           # cores, nome e slogan
├── hooks/useCarregar.js        # busca na API ao abrir/voltar para a tela
├── navigation/AppNavigator.js
├── screens/                    # telas do app
├── services/api.js             # chamadas fetch() à API
├── utils/formatar.js           # datas e rótulos
├── tests/                      # testes do app
├── backend/
│   ├── server.js, app.js
│   ├── config/ambiente.js      # lê e valida backend/.env
│   ├── database/conexao.js     # pool MySQL
│   ├── routes/                 # URLs → controllers
│   ├── controllers/            # regras de cada rota + SQL
│   ├── utils/validacoes.js
│   ├── tests/                  # testes da API
│   └── .env.example
├── database/mesa_cheia.sql
└── docs/
```

## Como executar

Requisitos: Node.js 20+, MySQL 8+ e o app **Expo Go** (ou um emulador Android).

**1. Banco de dados**

```bash
mysql -u root -p < database/mesa_cheia.sql
```

**2. API**

```bash
npm install
cp backend/.env.example backend/.env   # preencha DB_PASSWORD (e o que mais for diferente)
npm run api
```

Deve aparecer `Conectado ao MySQL`. Teste em `http://localhost:3000/doacoes`.

**3. Aplicativo**

```bash
npx expo start
```

Escaneie o QR code com o Expo Go ou pressione `a` (emulador Android) / `w` (navegador).

O app encontra a API assim:

| Onde o app roda | Endereço usado |
|---|---|
| Emulador Android | `http://10.0.2.2:3000` (padrão) |
| Navegador / simulador iOS | `http://localhost:3000` (padrão) |
| Celular com Expo Go | Crie `.env` na raiz com `EXPO_PUBLIC_API_URL=http://IP_DO_PC:3000` (mesma rede Wi-Fi) |

Veja `.env.example`. Depois de mudar o `.env`, reinicie o Expo (`npx expo start -c`).

## Testes

```bash
npm test
```

Cobre as regras de validação da API e os formatadores do app. Não precisa de banco nem de internet.

## Tipos de usuário (planejados)

| Nível | Pode |
|---|---|
| **Doador** | Criar, editar e cancelar as próprias ofertas |
| **Instituição** | Ver ofertas e reservar doações |
| **Administrador** | Gerenciar usuários e moderar ofertas |

Detalhes e matriz de permissões em [`docs/ENTREGA_2.md`](docs/ENTREGA_2.md#5-níveis-de-usuário-e-permissões-previstas).

## Tecnologias

React Native · Expo · React Navigation · Node.js · Express · MySQL (`mysql2`). Previstas para a Entrega 3: JWT e bcrypt.

## Segurança do repositório

Senhas, `JWT_SECRET` e arquivos `.env` **não** são versionados (ver `.gitignore`); só os modelos `.env.example`. Os usuários de exemplo do SQL não têm senha utilizável.

## Referência técnica

O projeto-modelo *loja-jwt* (usado em aula) serve como apoio para a organização da API e, depois, para autenticação e níveis de acesso. O domínio do Mesa Cheia (doações, reservas e três níveis de usuário) é próprio.
