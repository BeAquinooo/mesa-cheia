import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// O caminho parte deste arquivo: executar o Node em outra pasta não muda o .env lido.
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });

function portaValida(valor) {
  const porta = Number(valor);
  return Number.isInteger(porta) && porta >= 1 && porta <= 65535;
}

export default function validarAmbiente() {
  for (const nome of ['DB_HOST', 'DB_USER', 'DB_NAME']) {
    if (!process.env[nome]?.trim()) {
      throw new Error('Preencha ' + nome + ' em backend/.env (veja backend/.env.example).');
    }
  }

  // Senha vazia pode ser válida no MySQL local; a variável precisa existir.
  if (process.env.DB_PASSWORD === undefined) {
    throw new Error('Defina DB_PASSWORD em backend/.env, mesmo que fique vazia.');
  }
  if (!portaValida(process.env.DB_PORT || 3306)) {
    throw new Error('DB_PORT deve ser uma porta válida.');
  }
  if (!portaValida(process.env.PORT || 3000)) {
    throw new Error('PORT deve ser uma porta válida.');
  }
}
