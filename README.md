# Mesa Cheia

> Comida que sobra aqui, mesa cheia ali.

Aplicativo mobile para conectar doadores de alimentos (restaurantes, padarias, mercados e feirantes) a instituições comunitárias, reduzindo o desperdício e facilitando o acesso a alimentos.

## Tecnologias
- React Native com Expo e React Navigation
- API REST com Node.js e Express
- MySQL com `mysql2`
- Autenticação JWT (Bearer Token) e hash de senha com `bcryptjs`
- AsyncStorage para manter a sessão no aplicativo

## Estrutura
- `screens/`: telas do aplicativo, incluindo login, cadastro, doações, edição e gestão de usuários
- `services/api.js`: integração `fetch()` com a API e armazenamento da sessão
- `backend/routes/`: rotas HTTP
- `backend/controllers/`: regras e consultas
- `backend/middleware/auth.js`: validação JWT e níveis de acesso
- `database/mesa_cheia.sql`: estrutura e dados de demonstração
- `docs/`: proposta, entregas e roteiro de apresentação

## Requisitos
Node.js 20+, MySQL 8+, npm e Expo Go ou emulador Android.

## Como configurar

### 1. Banco de dados
Execute na pasta do projeto:

```bash
mysql -u root -p < database/mesa_cheia.sql
```

### 2. API
```bash
npm install
```
Copie `backend/.env.example` para `backend/.env` e informe as credenciais do seu MySQL. Defina `JWT_SECRET` com uma chave aleatória longa (mínimo de 32 caracteres). Não compartilhe nem envie o `.env` ao Git.

Inicie:
```bash
npm run api
```
A API estará em `http://localhost:3000`. O servidor deve mostrar a confirmação de conexão com o MySQL.

### 3. Aplicativo
Emulador Android: o padrão é `http://10.0.2.2:3000`.
Celular físico: crie `.env` na raiz a partir de `.env.example` e substitua o IP pelo endereço local do computador. Celular e computador devem estar na mesma rede.

```bash
npx expo start -c
```

## Funcionalidades

### Conta e sessão
- Cadastro de doador ou instituição.
- Senha armazenada somente como hash bcrypt (12 rounds).
- Login valida credenciais e retorna JWT com validade de 8 horas.
- O aplicativo mantém token e dados mínimos da sessão no AsyncStorage.
- Requisições autenticadas enviam `Authorization: Bearer <token>`.
- Logout remove a sessão local.

### Níveis e permissões
| Ação | Doador | Instituição | Admin |
|---|:---:|:---:|:---:|
| Listar e consultar doações | Sim | Sim | Sim |
| Publicar doação | Sim | Não | Sim |
| Editar/cancelar oferta | Própria | Não | Todas |
| Reservar doação | Não | Sim | Não |
| Consultar reservas próprias | Não | Sim | Todas |
| Listar usuários e alterar níveis | Não | Não | Sim |

As permissões são verificadas no back-end. A interface esconder botões não substitui a proteção das rotas.

**Importante:** por segurança, o cadastro público não permite criar conta de administrador. Para promover a primeira conta a admin em um banco local controlado, cadastre-a pelo app e execute `UPDATE usuarios SET nivel = 'admin' WHERE email = 'SEU_EMAIL';` no MySQL. Depois entre novamente no aplicativo para receber um token com o novo nível. Os usuários demonstrativos antigos do SQL têm hashes fictícios e não conseguem entrar; cadastre novas contas pelo aplicativo.

### Rotas principais
| Método | Rota | Acesso |
|---|---|---|
| POST | `/auth/cadastro` | Público |
| POST | `/auth/login` | Público |
| GET | `/categorias` | JWT |
| GET | `/doacoes`, `/doacoes/:id` | JWT |
| GET | `/doacoes/minhas` | Doador/Admin |
| POST | `/doacoes` | Doador/Admin |
| PUT/DELETE | `/doacoes/:id` | Doador proprietário/Admin |
| POST | `/reservas/:id` | Instituição |
| GET | `/reservas/minhas` | Instituição/Admin |
| GET | `/usuarios` | Admin |
| PUT | `/usuarios/:id/nivel` | Admin |

### Exemplo de autenticação
Login:
```http
POST /auth/login
Content-Type: application/json

{"email":"conta@exemplo.com","senha":"senha-com-8-caracteres"}
```
A resposta contém `token` e dados públicos do usuário. Para uma rota protegida:
```http
Authorization: Bearer SEU_TOKEN
```

## Testes
```bash
npm test
```
Os testes automatizados existentes cobrem validações e formatação sem precisar conectar ao banco. Os testes de integração completos devem ser executados com MySQL e API ligados; siga `docs/ENTREGA_3.md` e `docs/ENTREGA_4.md`.

## APK Android
O projeto contém `eas.json` com perfil `preview` configurado para gerar APK. Depois de configurar uma conta Expo/EAS e validar o app:

```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```
Ao final, o EAS fornece o link do APK. O APK precisa ser gerado após configurar o endereço público/ acessível da API. `localhost` e `10.0.2.2` não funcionam em um celular instalado fora do computador.

## Segurança
- Não versionar `.env`, JWT secret, senhas reais, certificados ou chaves de assinatura.
- Senhas nunca são retornadas pela API.
- Consultas usam parâmetros SQL.
- JWT expira em 8 horas.
- A API confere o nível e a propriedade da doação no servidor.
