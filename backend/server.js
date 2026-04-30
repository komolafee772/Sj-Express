const express = require('express');
const cors = require('cors');
require('dotenv').config();
const exportRoutes = require('./routes/exportRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', exportRoutes);

// Database Table Initialization
const initDB = async () => {
  console.log('Initializing database...');
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS exports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        contact_details VARCHAR(255),
        goods_type VARCHAR(255),
        weight_kg DECIMAL(10, 2),
        amount DECIMAL(15, 2) DEFAULT 0.00,
        destination VARCHAR(255),
        recipient_name VARCHAR(255),
        recipient_contact VARCHAR(255),
        pieces INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(createTableQuery);
    console.log('Main "exports" table verified/created.');

    // Ensure columns exist for existing tables (migration helper)
    const columnsToAdd = [
      { name: 'amount', type: 'DECIMAL(15, 2) DEFAULT 0.00' },
      { name: 'destination', type: 'VARCHAR(255)' },
      { name: 'recipient_name', type: 'VARCHAR(255)' },
      { name: 'recipient_contact', type: 'VARCHAR(255)' },
      { name: 'pieces', type: 'INT DEFAULT 0' }
    ];

    for (const column of columnsToAdd) {
      try {
        await db.query(`ALTER TABLE exports ADD COLUMN ${column.name} ${column.type}`);
        console.log(`Added column "${column.name}" to "exports" table.`);
      } catch (err) {
        // mysql2 returns error codes in err.code. ER_DUP_COLUMN_NAME is 'ER_DUP_COLUMN_NAME'
        if (err.code !== 'ER_DUP_COLUMN_NAME' && err.errno !== 1060) {
          console.error(`Error adding column ${column.name}:`, err.message);
        }
      }
    }

    console.log('Database initialization complete. Table "exports" is ready.');
  } catch (error) {
    console.error('Critical Database initialization error:', error.message);
    // Log the full error for debugging but don't stop the server unless connection fails
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Failed to connect to database. Please check your credentials.');
    }
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});
