const express = require('express');
const router = express.Router();
const { getStats, getChartData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/charts', protect, getChartData);

module.exports = router;
