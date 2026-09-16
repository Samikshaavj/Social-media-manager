const analyticsService = require('../services/analyticsService');

// @desc    Get top-level dashboard stats
// @route   GET /api/analytics/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getDashboardStats(req.user.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get chart data
// @route   GET /api/analytics/charts
// @access  Private
const getChartData = async (req, res, next) => {
  try {
    const data = await analyticsService.getChartData(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getChartData,
};
