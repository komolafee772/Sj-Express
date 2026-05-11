const db = require('../config/db');
const excelGenerator = require('../utils/excelGenerator');
const pdfGenerator = require('../utils/pdfGenerator');

const getAllExports = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM exports WHERE 1=1';
    const params = [];
    if (search) {
      query += ' AND (client_name LIKE ? OR recipient_name LIKE ? OR id LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exports', error: error.message });
  }
};

const createExport = async (req, res) => {
  const data = {
    client_name: req.body.client_name || 'New Sender',
    contact_details: req.body.contact_details || '',
    goods_type: req.body.goods_type || 'General',
    weight_kg: Number(req.body.weight_kg || 0),
    amount: Number(req.body.amount || 0),
    destination: req.body.destination || null,
    recipient_name: req.body.recipient_name || 'New Receiver',
    recipient_contact: req.body.recipient_contact || '',
    pieces: Number(req.body.pieces || 0),
    sender_address: req.body.sender_address || null,
    receiver_address: req.body.receiver_address || null,
    package_description: req.body.package_description || null,
    paid_by: req.body.paid_by || 'Sender'
  };

  try {
    const [result] = await db.query('INSERT INTO exports SET ?', data);
    res.status(201).json({ id: result.insertId, ...data, created_at: new Date().toISOString(), is_locked: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error creating export', error: error.message });
  }
};

const updateExport = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query('SELECT * FROM exports WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Export not found' });
    if (existing[0].is_locked) return res.status(403).json({ message: 'This record is locked and cannot be modified.' });

    const data = {
      client_name: req.body.client_name !== undefined ? req.body.client_name : existing[0].client_name,
      contact_details: req.body.contact_details !== undefined ? req.body.contact_details : existing[0].contact_details,
      goods_type: req.body.goods_type !== undefined ? req.body.goods_type : existing[0].goods_type,
      weight_kg: req.body.weight_kg !== undefined ? req.body.weight_kg : existing[0].weight_kg,
      amount: req.body.amount !== undefined ? req.body.amount : existing[0].amount,
      destination: req.body.destination !== undefined ? req.body.destination : existing[0].destination,
      recipient_name: req.body.recipient_name !== undefined ? req.body.recipient_name : existing[0].recipient_name,
      recipient_contact: req.body.recipient_contact !== undefined ? req.body.recipient_contact : existing[0].recipient_contact,
      pieces: req.body.pieces !== undefined ? req.body.pieces : existing[0].pieces,
      sender_address: req.body.sender_address !== undefined ? req.body.sender_address : existing[0].sender_address,
      receiver_address: req.body.receiver_address !== undefined ? req.body.receiver_address : existing[0].receiver_address,
      package_description: req.body.package_description !== undefined ? req.body.package_description : existing[0].package_description,
      paid_by: req.body.paid_by !== undefined ? req.body.paid_by : existing[0].paid_by
    };

    await db.query('UPDATE exports SET ? WHERE id = ?', [data, id]);
    res.status(200).json({ id, ...data });
  } catch (error) {
    res.status(500).json({ message: 'Error updating export', error: error.message });
  }
};

const lockExport = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE exports SET is_locked = 1 WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Export not found' });
    res.status(200).json({ message: 'Export locked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error locking export', error: error.message });
  }
};

const deleteExport = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query('SELECT is_locked FROM exports WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Export not found' });
    if (existing[0].is_locked) return res.status(403).json({ message: 'This record is locked and cannot be deleted.' });
    await db.query('DELETE FROM exports WHERE id = ?', [id]);
    res.status(200).json({ message: 'Export deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting export', error: error.message });
  }
};

const getExportById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM exports WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Export not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching export', error: error.message });
  }
};

const exportToExcel = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM exports ORDER BY created_at DESC');
    const buffer = excelGenerator.generate(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=exports.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting to Excel', error: error.message });
  }
};

const exportToPdf = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM exports ORDER BY created_at DESC');
    pdfGenerator.generate(rows, res);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting to PDF', error: error.message });
  }
};

module.exports = { getAllExports, getExportById, createExport, updateExport, lockExport, deleteExport, exportToExcel, exportToPdf };
