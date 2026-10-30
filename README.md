# Mesa Cheia

> Comida que sobra aqui, mesa cheia ali.

Aplicativo mobile que conecta **quem tem alimento sobrando** (restaurantes, padarias, mercados, feirantes) a **quem pode aproveitá-lo** (ONGs, cozinhas comunitárias, abrigos), reduzindo o desperdício e ajudando a combater a fome.

Projeto avaliativo: *Aplicação Mobile com JWT e Níveis de Usuário*, desenvolvido em 4 entregas.

📄 **Proposta completa (problema, público, justificativa, usuários, telas e fluxo):** [`docs/PROPOSTA.md`](docs/PROPOSTA.md)

## Status das entregas

| Entrega | Conteúdo | Status |
|---|---|---|
| 1 | Proposta e estrutura inicial (Expo, navegação, telas) | ✅ Esta versão |
| 2 | Modelagem, MySQL, API Express e primeira integração com `fetch()` | ⏳ |
| 3 | Cadastro, login, hash, JWT, níveis, rotas protegidas e CRUD | ⏳ |
| 4 | Testes, APK final e apresentação | ⏳ |

## O que existe na Entrega 1

- Projeto **Expo** (React Native) com **React Navigation** (native stack)
- **6 telas** com navegação funcionando entre elas
- Identidade inicial: nome, paleta (verde, laranja e creme) e ícone
- Dados de **exemplo** locais (`data/doacoes.js`); na Entrega 2 passam a vir da API
- A tela **Entrar** é apenas visual: ainda **não** há autenticação (Entrega 3)

### Fluxo de navegação

```
BoasVindas ──► Entrar ──► Inicio ──┬──► Doacoes ──► DetalhesDoacao
     │                             │
     └──► ComoFunciona ◄───────────┘
```

## Tipos de usuário (planejados)

| Nível | Pode |
|---|---|
| **Doador** | Criar, editar e cancelar as próprias ofertas |
| **Instituição** | Ver ofertas e reservar doações |
| **Administrador** | Gerenciar usuários e moderar ofertas |

## Estrutura de pastas

```
mesa-cheia/
├── App.js                  # raiz: SafeAreaProvider + NavigationContainer
├── index.js                # registra o App no Expo
├── app.json                # configuração do Expo
├── package.json
├── assets/                 # ícones e splash
├── components/ui.js        # Botao, Cartao, Selo, Pagina, estilos comuns
├── constants/tema.js       # cores, nome e slogan
├── data/doacoes.js         # dados de exemplo (Entrega 1)
├── docs/PROPOSTA.md        # proposta do projeto
├── navigation/AppNavigator.js
└── screens/
    ├── BoasVindas.js
    ├── Entrar.js
    ├── Inicio.js
    ├── Doacoes.js
    ├── DetalhesDoacao.js
    └── ComoFunciona.js
```

## Como executar

Requisitos: Node.js 20+ e o app **Expo Go** no celular (ou um emulador Android).

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go, ou pressione `a` para abrir no emulador Android. Para testar no navegador: `npm run web`.

## Tecnologias

React Native · Expo · React Navigation. Previstas para as próximas entregas: Node.js, Express, MySQL, JWT, bcrypt.

## Segurança do repositório

Senhas, `JWT_SECRET` e arquivos `.env` **não** são versionados (ver `.gitignore`). Quando a API for criada, será incluído um `.env.example` sem dados reais.

## Referência técnica

O projeto-modelo *loja-jwt* (usado em aula) serve como apoio para autenticação, JWT e níveis de acesso. O domínio do Mesa Cheia (ofertas de doação, reservas e três níveis de usuário) é próprio.
