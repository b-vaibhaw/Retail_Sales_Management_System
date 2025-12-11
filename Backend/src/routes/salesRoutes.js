const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Get transactions with search, filter, sort, pagination
router.get('/transactions', salesController.getTransactions);

// Get available filter options
router.get('/filter-options', salesController.getFilterOptions);

// Get statistics
router.get('/stats', salesController.getStats);

module.exports = router;