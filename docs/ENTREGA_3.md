# Mesa Cheia — Entrega 3: autenticação, JWT, níveis e CRUD

## O que foi implementado
1. Cadastro de doadores e instituições em `POST /auth/cadastro`.
2. Hash bcrypt com fator de custo 12; senha original não é gravada nem devolvida.
3. Login com validação em `POST /auth/login`.
4. JWT assinado com `JWT_SECRET`, emissor `mesa-cheia-api` e expiração de 8 horas.
5. Armazenamento local da sessão no AsyncStorage e envio de `Authorization: Bearer <token>`.
6. Logout com remoção da sessão local.
7. Middleware `autenticarToken` para verificar assinatura/expiração e `permitirNiveis` para autorizar níveis.
8. Níveis `doador`, `instituicao` e `admin`; cadastro público só cria os dois primeiros.
9. CRUD de doações: listar, consultar, cadastrar, editar e cancelar (cancelamento lógico).
10. Reserva de doação para instituições, com transação e bloqueio da linha para evitar duas reservas simultâneas.
11. Administração de usuários e níveis, protegida para admin.

## Regras de segurança
- O `doador_id` da nova oferta vem de `req.usuario.id`, nunca do corpo enviado pelo aplicativo.
- Um doador só edita/cancela ofertas próprias; admin pode moderar qualquer oferta.
- Instituição pode reservar, mas não publicar/editar ofertas.
- Admin pode listar e alterar nível de outros usuários, mas não o próprio nível pela rota.
- Rotas de doações e categorias exigem token válido.
- A senha é comparada com bcrypt; não há comparação de texto puro.

## Matriz de permissões
| Recurso | Doador | Instituição | Admin |
|---|---|---|---|
| Consultar doações/categorias | JWT | JWT | JWT |
| Criar doação | Sim | Não | Sim |
| Editar/cancelar | Própria | Não | Todas |
| Reservar | Não | Sim | Não |
| Consultar reservas | Não | Próprias | Todas |
| Gerenciar usuários | Não | Não | Sim |

## Teste manual da Entrega 3
1. Criar uma conta do tipo doador pelo aplicativo.
2. Sair e entrar novamente com as mesmas credenciais.
3. Criar uma doação e confirmar que ela aparece na listagem.
4. Editar a doação e verificar a atualização.
5. Cancelar a doação e confirmar que ela deixa de aparecer entre as disponíveis.
6. Criar uma conta do tipo instituição e tentar reservar uma oferta disponível.
7. Fazer chamadas sem `Authorization`: a API deve responder `401`.
8. Tentar acessar rota de outro nível: a API deve responder `403`.
9. Validar token expirado/inválido: a API deve responder `401`.

## Configuração
`backend/.env` precisa conter `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `JWT_SECRET` (mínimo de 32 caracteres). O arquivo real não deve ser versionado.
