async function testApi() {
  try {
    const response = await fetch('http://localhost:5000/api/exports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'API Test Fetch',
        contact_details: 'Fetch Contact',
        goods_type: 'Fetch Goods',
        weight_kg: 9.9,
        amount: 99.0,
        destination: 'Fetch Dest',
        recipient_name: 'Fetch Recp',
        recipient_contact: 'Fetch Recp Contact',
        pieces: 9
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

testApi();
