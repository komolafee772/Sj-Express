const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/exports', exportController.getAllExports);
router.get('/exports/:id', exportController.getExportById);
router.post('/exports', exportController.createExport);
router.put('/exports/:id', exportController.updateExport);
router.delete('/exports/:id', exportController.deleteExport);

router.get('/export/excel', exportController.exportToExcel);
router.get('/export/pdf', exportController.exportToPdf);

module.exports = router;
