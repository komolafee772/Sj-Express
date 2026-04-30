const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Determine CA path - prefer environment variable, fallback to default path
const caPath = process.env.DB_SSL_CA || path.join(__dirname, 'ca.pem');
let sslConfig = null;

try {
  if (fs.existsSync(caPath)) {
    sslConfig = {
      ca: fs.readFileSync(caPath),
      rejectUnauthorized: true
    };
    console.log('Database: SSL CA certificate loaded.');
  } else {
    console.warn(`Database: SSL CA certificate not found at ${caPath}. Connecting without SSL or using default system CAs.`);
  }
} catch (error) {
  console.error('Database: Error reading SSL CA certificate:', error.message);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

module.exports = pool;
