const express = require('express');
const router = express.Router();
const { getStats, getChartData, getTopPosts, syncAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/charts', protect, getChartData);
router.get('/top-posts', protect, getTopPosts);
router.post('/sync', protect, syncAnalytics);

module.exports = router;

