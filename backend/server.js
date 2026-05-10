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
        client_name VARCHAR(150) NOT NULL,
        contact_details VARCHAR(100) NOT NULL,
        goods_type VARCHAR(150) NOT NULL,
        weight_kg DECIMAL(10, 2) NOT NULL,
        amount DECIMAL(15, 2) DEFAULT 0.00,
        destination VARCHAR(255),
        recipient_name VARCHAR(255),
        recipient_contact VARCHAR(255),
        pieces INT DEFAULT 0,
        sender_address TEXT,
        receiver_address TEXT,
        package_description TEXT,
        is_locked TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
      { name: 'pieces', type: 'INT DEFAULT 0' },
      { name: 'sender_address', type: 'TEXT' },
      { name: 'receiver_address', type: 'TEXT' },
      { name: 'package_description', type: 'TEXT' },
      { name: 'is_locked', type: 'TINYINT(1) DEFAULT 0' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ];

    for (const col of columnsToAdd) {
      try {
        await db.query(`ALTER TABLE exports ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added column: ${col.name}`);
      } catch (err) {
        // Column likely already exists
      }
    }

    console.log('Database initialization complete. Table "exports" is ready.');
  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
};

initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
