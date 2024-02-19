import mysql from 'mysql2';

const DB_HOST = '168.138.247.202';
const DB_USER = 'praxio';
const DB_PASSWORD = 'Fi4ZZFhfcF01E1F';
const DB_DATABASE = 'praxiotest';

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

export default db;
