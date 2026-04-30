async function testUpdate() {
  try {
    const response = await fetch('http://localhost:5000/api/exports/5', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'Updated Fetch Client',
        contact_details: 'Updated Contact',
        goods_type: 'Updated Goods',
        weight_kg: 12.5,
        amount: 150.0,
        destination: 'Updated Dest',
        recipient_name: 'Updated Recp',
        recipient_contact: 'Updated Recp Contact',
        pieces: 12
      })
    });
    const data = await response.json();
    console.log('API Status:', response.status);
    console.log('API Response:', data);
    process.exit(0);
  } catch (error) {
    console.error('API Error:', error.message);
    process.exit(1);
  }
}

testUpdate();
