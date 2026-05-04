const db = require('../config/db');
const excelGenerator = require('../utils/excelGenerator');
const pdfGenerator = require('../utils/pdfGenerator');

const getAllExports = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM exports ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Controller: Error fetching exports:', error.message);
    res.status(500).json({ message: 'Error fetching exports', error: error.message });
  }
};

const createExport = async (req, res) => {
  console.log('Controller: Incoming Create Request Body:', req.body);
  const { client_name, contact_details, goods_type, weight_kg, amount, destination, recipient_name, recipient_contact, pieces } = req.body;
  
  if (!client_name) {
    return res.status(400).json({ message: 'client_name is required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO exports (client_name, contact_details, goods_type, weight_kg, amount, destination, recipient_name, recipient_contact, pieces) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        client_name, 
        contact_details || null, 
        goods_type || null, 
        weight_kg || 0, 
        amount || 0, 
        destination || null, 
        recipient_name || null, 
        recipient_contact || null, 
        pieces || 0
      ]
    );
    console.log('Controller: Export created successfully, ID:', result.insertId);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Controller: Error creating export:', error.message);
    res.status(500).json({ message: 'Error creating export', error: error.message });
  }
};

const updateExport = async (req, res) => {
  const { id } = req.params;
  console.log(`Controller: Incoming Update Request for ID ${id}:`, req.body);
  const { client_name, contact_details, goods_type, weight_kg, amount, destination, recipient_name, recipient_contact, pieces } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE exports SET client_name = ?, contact_details = ?, goods_type = ?, weight_kg = ?, amount = ?, destination = ?, recipient_name = ?, recipient_contact = ?, pieces = ? WHERE id = ?',
      [
        client_name, 
        contact_details || null, 
        goods_type || null, 
        weight_kg || 0, 
        amount || 0, 
        destination || null, 
        recipient_name || null, 
        recipient_contact || null, 
        pieces || 0, 
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Export not found' });
    }
    
    console.log(`Controller: Export ID ${id} updated successfully.`);
    res.status(200).json({ id, ...req.body });
  } catch (error) {
    console.error(`Controller: Error updating export ID ${id}:`, error.message);
    res.status(500).json({ message: 'Error updating export', error: error.message });
  }
};

const deleteExport = async (req, res) => {
  const { id } = req.params;
  console.log(`Controller: Incoming Delete Request for ID ${id}`);
  try {
    const [result] = await db.query('DELETE FROM exports WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Export not found' });
    }
    console.log(`Controller: Export ID ${id} deleted successfully.`);
    res.status(200).json({ message: 'Export deleted successfully' });
  } catch (error) {
    console.error(`Controller: Error deleting export ID ${id}:`, error.message);
    res.status(500).json({ message: 'Error deleting export', error: error.message });
  }
};

const getExportById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM exports WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Export not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Controller: Error fetching export ID ${id}:`, error.message);
    res.status(500).json({ message: 'Error fetching export', error: error.message });
  }
};

const exportToExcel = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM exports');
    const buffer = excelGenerator.generate(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=exports.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Controller: Error exporting to Excel:', error.message);
    res.status(500).json({ message: 'Error exporting to Excel', error: error.message });
  }
};

const exportToPdf = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM exports');
    pdfGenerator.generate(rows, res);
  } catch (error) {
    console.error('Controller: Error exporting to PDF:', error.message);
    res.status(500).json({ message: 'Error exporting to PDF', error: error.message });
  }
};

module.exports = {
  getAllExports,
  getExportById,
  createExport,
  updateExport,
  deleteExport,
  exportToExcel,
  exportToPdf
};
