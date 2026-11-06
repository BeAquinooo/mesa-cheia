import '../config/ambiente.js';
import mysql from 'mysql2/promise';

// O pool reaproveita conexões. As credenciais vêm do ambiente, nunca do código-fonte.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  // DATE e DATETIME chegam como texto ('2026-11-06 15:00:00'), sem conversão de fuso horário.
  dateStrings: true,
});

export default pool;
