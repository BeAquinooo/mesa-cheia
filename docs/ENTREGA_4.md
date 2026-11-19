# Mesa Cheia — Entrega 4: finalização, testes, APK e apresentação

## Revisão final
- [x] Fluxo de cadastro e login integrado à API.
- [x] Hash de senha e JWT com expiração.
- [x] Bearer Token e middleware de autenticação.
- [x] Níveis e permissões verificados no back-end.
- [x] CRUD de doações e reserva para instituição.
- [x] Logout e persistência local da sessão.
- [x] README e exemplo de variáveis de ambiente.
- [ ] Executar testes com o banco MySQL local configurado.
- [ ] Testar o app em celular Android real com URL acessível da API.
- [ ] Gerar o APK no EAS e instalar em aparelho compatível.
- [ ] Fazer commit e push finais e confirmar o repositório remoto.

Os itens marcados como pendentes dependem do ambiente, credenciais Expo e repositório remoto do responsável. Não considerar o APK concluído antes de baixar e instalar o arquivo gerado.

## Roteiro de testes funcionais
| Teste | Resultado esperado |
|---|---|
| Cadastro com dados válidos | HTTP 201 e conta criada |
| Cadastro com e-mail repetido | HTTP 409 |
| Cadastro com senha curta | HTTP 400 |
| Login correto | HTTP 200 e JWT |
| Login incorreto | HTTP 401 |
| Rota protegida sem token | HTTP 401 |
| Token inválido/expirado | HTTP 401 |
| Doador cria oferta | HTTP 201 |
| Instituição tenta criar oferta | HTTP 403 |
| Doador edita oferta de outra pessoa | HTTP 403 |
| Instituição reserva oferta disponível | HTTP 201 |
| Segunda reserva da mesma oferta | HTTP 409 |
| Usuário comum acessa gestão de usuários | HTTP 403 |
| Admin altera nível de outro usuário | HTTP 200 |

## Gerar o APK
1. Instale Node.js e dependências (`npm install`).
2. Configure a URL da API para um endereço acessível no celular. Em produção, publique a API em servidor HTTPS.
3. Entre na conta Expo: `npx eas-cli login`.
4. Configure o projeto: `npx eas-cli build:configure`.
5. Execute `npx eas-cli build --platform android --profile preview`.
6. Acesse o link informado pelo EAS, baixe o `.apk` e instale em Android compatível.
7. Teste login, listagem, reserva e CRUD no APK instalado.
8. Guarde o APK da mesma versão que foi enviada ao repositório.

## Roteiro sugerido para apresentação
1. **Problema:** alimentos próprios para consumo são desperdiçados enquanto instituições precisam de doações.
2. **Solução:** Mesa Cheia conecta doadores e instituições, organizando ofertas, retirada e reservas.
3. **Demonstração:** criar conta, entrar, visualizar doações e publicar/editar/cancelar uma oferta.
4. **Níveis:** mostrar que doador publica e administra suas próprias ofertas; instituição reserva; administrador gerencia usuários.
5. **API e banco:** explicar que o React Native usa `fetch()` para chamar a API Express, que consulta o MySQL.
6. **Hash:** bcrypt transforma a senha em um hash antes de armazenar. A senha original não fica no banco.
7. **JWT:** após login, a API assina um token com validade limitada; o aplicativo o envia no cabeçalho Bearer.
8. **Middleware:** verifica o token e o nível antes de liberar uma rota.
9. **CRUD:** demonstrar criação, leitura, atualização e cancelamento lógico de doação.
10. **Entrega:** mostrar repositório, histórico de commits, README, script SQL e APK instalado.

## Observação sobre o APK e o repositório
O build Android precisa ser feito com uma conta Expo/EAS e uma API acessível externamente. O arquivo APK não é produzido apenas por editar o código. O push ao Git também precisa ser feito com acesso ao repositório remoto correto.
