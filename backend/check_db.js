const db = require('./config/db');

async function checkSchema() {
  try {
    const [rows] = await db.query('DESCRIBE exports');
    console.log('Table structure:');
    console.table(rows);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
