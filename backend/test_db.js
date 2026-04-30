const db = require('./config/db');

async function testInsert() {
  try {
    const newRecord = {
      client_name: 'Test Client',
      contact_details: 'Test Contact',
      goods_type: 'Test Goods',
      weight_kg: 10.5,
      amount: 100.0,
      destination: 'Test Destination',
      recipient_name: 'Test Recipient',
      recipient_contact: 'Test Recipient Contact',
      pieces: 5
    };

    const { client_name, contact_details, goods_type, weight_kg, amount, destination, recipient_name, recipient_contact, pieces } = newRecord;
    
    console.log('Inserting record...');
    const [result] = await db.query(
      'INSERT INTO exports (client_name, contact_details, goods_type, weight_kg, amount, destination, recipient_name, recipient_contact, pieces) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client_name, contact_details, goods_type, weight_kg, amount || 0, destination, recipient_name, recipient_contact, pieces || 0]
    );
    console.log('Insert successful, ID:', result.insertId);

    const [rows] = await db.query('SELECT * FROM exports WHERE id = ?', [result.insertId]);
    console.log('Retrieved record:', rows[0]);

    process.exit(0);
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

testInsert();
