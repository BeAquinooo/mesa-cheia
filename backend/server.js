import validarAmbiente from './config/ambiente.js';
import app from './app.js';
import pool from './database/conexao.js';

try {
  // Configuração ausente é detectada antes de aceitar qualquer requisição.
  validarAmbiente();

  // Testa o MySQL na partida: assim o erro de conexão aparece aqui, não na primeira requisição.
  await pool.query('SELECT 1');
  console.log('Conectado ao MySQL (' + process.env.DB_NAME + ').');

  const porta = Number(process.env.PORT || 3000);
  // 0.0.0.0 permite que o celular (mesma rede Wi-Fi) alcance a API.
  const servidor = app.listen(porta, '0.0.0.0', function iniciarServidor() {
    console.log('API executando em http://localhost:' + porta);
  });
  servidor.on('error', function informarErroServidor(erro) {
    console.error(erro.code === 'EADDRINUSE' ? 'A porta da API já está em uso.' : 'Não foi possível iniciar a API.');
    process.exitCode = 1;
  });
} catch (erro) {
  console.error('Não foi possível iniciar a API: ' + erro.message);
  process.exit(1);
}
