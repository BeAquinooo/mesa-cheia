-- Mesa Cheia — banco de dados MySQL (Entrega 2)
-- Como executar:  mysql -u root -p < database/mesa_cheia.sql
-- O script pode ser executado mais de uma vez: usa IF NOT EXISTS e INSERT IGNORE.

CREATE DATABASE IF NOT EXISTS mesa_cheia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mesa_cheia;

-- ---------------------------------------------------------------------------
-- USUARIOS: quem usa o aplicativo. O nível define o que a pessoa pode fazer.
-- A autenticação (cadastro, login, JWT) entra na Entrega 3; a tabela já nasce pronta.
-- senha_hash guardará o hash do bcrypt, nunca a senha em texto.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  senha_hash  VARCHAR(255) NOT NULL,
  nivel       ENUM('doador', 'instituicao', 'admin') NOT NULL DEFAULT 'doador',
  telefone    VARCHAR(20) NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- CATEGORIAS: tipos de alimento. Tabela própria evita repetir texto em cada doação.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome  VARCHAR(60) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_nome (nome)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- DOACOES: entidade principal. Cada linha é uma oferta de alimento de um doador.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doacoes (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  doador_id        INT UNSIGNED NOT NULL,
  categoria_id     INT UNSIGNED NOT NULL,
  titulo           VARCHAR(120) NOT NULL,
  descricao        VARCHAR(500) NOT NULL DEFAULT '',
  quantidade       VARCHAR(60)  NOT NULL,
  refeicoes        INT UNSIGNED NOT NULL DEFAULT 0,
  validade         DATE NOT NULL,
  local_retirada   VARCHAR(120) NOT NULL,
  retirada_inicio  DATETIME NOT NULL,
  retirada_fim     DATETIME NOT NULL,
  status           ENUM('disponivel', 'reservada', 'retirada', 'cancelada') NOT NULL DEFAULT 'disponivel',
  criado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_doacoes_status_validade (status, validade),
  KEY idx_doacoes_categoria (categoria_id),
  KEY idx_doacoes_doador (doador_id),
  CONSTRAINT fk_doacoes_doador    FOREIGN KEY (doador_id)    REFERENCES usuarios (id),
  CONSTRAINT fk_doacoes_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id),
  CONSTRAINT ck_doacoes_retirada  CHECK (retirada_fim > retirada_inicio)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- RESERVAS: a instituição reserva uma doação. A API de reservas entra na Entrega 3.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservas (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  doacao_id       INT UNSIGNED NOT NULL,
  instituicao_id  INT UNSIGNED NOT NULL,
  status          ENUM('pendente', 'confirmada', 'retirada', 'cancelada') NOT NULL DEFAULT 'pendente',
  criada_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reservas_doacao (doacao_id),
  KEY idx_reservas_instituicao (instituicao_id),
  CONSTRAINT fk_reservas_doacao      FOREIGN KEY (doacao_id)      REFERENCES doacoes (id),
  CONSTRAINT fk_reservas_instituicao FOREIGN KEY (instituicao_id) REFERENCES usuarios (id)
) ENGINE=InnoDB;

-- ===========================================================================
-- DADOS DE EXEMPLO (para testar a API e o aplicativo)
-- ===========================================================================

INSERT IGNORE INTO categorias (id, nome) VALUES
  (1, 'Refeições'),
  (2, 'Padaria'),
  (3, 'Hortifruti'),
  (4, 'Mercearia');

-- Estes usuários são só de exemplo e NÃO conseguem fazer login: o valor de senha_hash
-- não é um hash válido. Na Entrega 3 o cadastro passa a gravar hashes reais do bcrypt.
INSERT IGNORE INTO usuarios (id, nome, email, senha_hash, nivel, telefone) VALUES
  (1, 'Restaurante Sabor da Vila',  'saborvila@exemplo.com',  '!SEM_LOGIN_NA_ENTREGA_2', 'doador',      '(11) 90000-0001'),
  (2, 'Padaria Pão Quente',         'paoquente@exemplo.com',  '!SEM_LOGIN_NA_ENTREGA_2', 'doador',      '(11) 90000-0002'),
  (3, 'Cozinha Comunitária Esperança', 'esperanca@exemplo.com', '!SEM_LOGIN_NA_ENTREGA_2', 'instituicao', '(11) 90000-0003'),
  (4, 'Administração Mesa Cheia',   'admin@exemplo.com',      '!SEM_LOGIN_NA_ENTREGA_2', 'admin',       NULL);

-- Datas relativas a hoje, para a lista sempre aparecer com doações dentro da validade.
INSERT IGNORE INTO doacoes
  (id, doador_id, categoria_id, titulo, descricao, quantidade, refeicoes, validade, local_retirada, retirada_inicio, retirada_fim)
VALUES
  (1, 1, 1, 'Marmitas do almoço',
   'Arroz, feijão, frango assado e salada. Sobra de produção do almoço, embalada e mantida refrigerada.',
   '25 marmitas', 25, CURDATE(), 'Centro',
   TIMESTAMP(CURDATE(), '15:00:00'), TIMESTAMP(CURDATE(), '16:00:00')),
  (2, 2, 2, 'Pães e bolos do dia',
   'Pães franceses, de forma e bolos simples produzidos hoje que não foram vendidos.',
   '3 caixas', 30, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Bairro Jardim',
   TIMESTAMP(CURDATE(), '19:00:00'), TIMESTAMP(CURDATE(), '20:00:00')),
  (3, 1, 3, 'Frutas e verduras',
   'Bananas, tomates, alface e laranjas. Alguns itens têm aparência fora do padrão, mas estão próprios para consumo.',
   '40 kg', 80, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Praça Central',
   TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:00:00'), TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00')),
  (4, 2, 4, 'Arroz, feijão e macarrão',
   'Pacotes com embalagem levemente danificada, produto intacto e dentro da validade.',
   '60 pacotes', 120, DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Vila Nova',
   TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00'), TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '11:00:00')),
  (5, 1, 1, 'Sopa e pães de jantar',
   'Sopa de legumes com pão. Produzida hoje, mantida quente até a retirada.',
   '15 porções', 15, CURDATE(), 'Centro',
   TIMESTAMP(CURDATE(), '21:00:00'), TIMESTAMP(CURDATE(), '22:00:00'));
