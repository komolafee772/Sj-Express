const PDFDocument = require('pdfkit');

const generate = (data, res) => {
  const doc = new PDFDocument({ margin: 30, layout: 'landscape' });

  // Pipe the PDF into the response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=export-invoice.pdf');
  doc.pipe(res);

  // Add Header
  doc
    .fillColor('#1A4D8F')
    .fontSize(20)
    .text('SJ EXPRESS - EXPORT SUMMARY', { align: 'center' })
    .moveDown();

  doc
    .strokeColor('#1A4D8F')
    .lineWidth(1)
    .moveTo(30, 70)
    .lineTo(760, 70)
    .stroke()
    .moveDown(2);

  // Add Table Headers
  const headers = [
    { label: 'Client', x: 30 },
    { label: 'Goods', x: 130 },
    { label: 'Weight', x: 210 },
    { label: 'Amount', x: 270 },
    { label: 'Destination', x: 340 },
    { label: 'Recipient', x: 450 },
    { label: 'Rec. Contact', x: 560 },
    { label: 'Pieces', x: 680 },
    { label: 'Date', x: 730 }
  ];

  doc.fillColor('#0B3D91').fontSize(10);
  headers.forEach(h => {
    doc.text(h.label, h.x, 90);
  });

  doc
    .strokeColor('#CCCCCC')
    .moveTo(30, 105)
    .lineTo(760, 105)
    .stroke()
    .moveDown(0.5);

  // Add Records
  let y = 115;
  doc.fillColor('#333333').fontSize(9);

  data.forEach((item) => {
    if (y > 500) {
      doc.addPage();
      y = 50;
    }
    
    doc.text(item.client_name || '', 30, y, { width: 90 });
    doc.text(item.goods_type || '', 130, y, { width: 70 });
    doc.text(`${item.weight_kg || 0}kg`, 210, y, { width: 50 });
    doc.text(`$${item.amount || 0}`, 270, y, { width: 60 });
    doc.text(item.destination || '', 340, y, { width: 100 });
    doc.text(item.recipient_name || '', 450, y, { width: 100 });
    doc.text(item.recipient_contact || '', 560, y, { width: 110 });
    doc.text(`${item.pieces || 0}`, 680, y, { width: 40 });
    doc.text(new Date(item.created_at).toLocaleDateString(), 730, y, { width: 50 });
    
    y += 25;
    
    // Add a subtle line between rows
    doc.strokeColor('#F0F0F0').moveTo(30, y - 5).lineTo(760, y - 5).stroke();
  });

  // Footer
  doc
    .fontSize(8)
    .fillColor('#999999')
    .text(`SJ Express Export Manager - Generated on ${new Date().toLocaleString()}`, 30, 550, { align: 'center' });

  doc.end();
};

module.exports = { generate };
