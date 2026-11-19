# Mesa Cheia — roteiro de apresentação

## 1. Problema
O desperdício de alimentos acontece ao mesmo tempo em que instituições sociais precisam de alimentos para atender pessoas. Muitas vezes, doadores e instituições não têm um canal simples para organizar ofertas e retiradas.

## 2. Solução
O Mesa Cheia é um aplicativo mobile que aproxima doadores e instituições. O doador publica alimentos disponíveis, com quantidade, validade e local/horário de retirada. A instituição consulta e reserva uma oferta.

## 3. Tecnologias
- Aplicativo: React Native, Expo e React Navigation.
- Servidor: Node.js e Express.
- Banco: MySQL.
- Comunicação: API REST e `fetch()`.
- Segurança: bcrypt, JWT, Bearer Token e middleware.

## 4. Níveis de usuário
- Doador: cria, edita e cancela as próprias ofertas.
- Instituição: consulta e reserva ofertas.
- Administrador: modera ofertas e gerencia níveis de usuários.

## 5. Segurança
A senha é armazenada como hash bcrypt. No login, a API compara a senha digitada com o hash. Se estiver correta, gera um JWT com validade de oito horas. O aplicativo envia esse token no cabeçalho `Authorization: Bearer`. O middleware valida a assinatura e a expiração e verifica as permissões antes de executar a rota.

## 6. Demonstração
1. Criar conta e fazer login.
2. Mostrar lista e detalhes de doações.
3. Criar, editar e cancelar uma doação com usuário doador.
4. Entrar como instituição e reservar uma oferta.
5. Mostrar bloqueio de acesso para perfil sem permissão.
6. Mostrar banco MySQL, repositório, commits e APK.

## 7. Encerramento
O projeto transforma a necessidade de reduzir o desperdício em um fluxo digital organizado, com autenticação, níveis de acesso e persistência de dados.
