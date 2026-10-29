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

// @desc    Get chart data with range and platform filters
// @route   GET /api/analytics/charts
// @access  Private
const getChartData = async (req, res, next) => {
  try {
    const { range, platform } = req.query;
    const data = await analyticsService.getChartData(req.user.id, range || '7d', platform || 'ALL');
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get top performing published posts
// @route   GET /api/analytics/top-posts
// @access  Private
const getTopPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const posts = await analyticsService.getTopPosts(req.user.id, limit);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Force a live sync of analytics from connected platforms
// @route   POST /api/analytics/sync
// @access  Private
const syncAnalytics = async (req, res, next) => {
  try {
    const result = await analyticsService.syncUserAnalytics(req.user.id, true);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getChartData,
  getTopPosts,
  syncAnalytics,
};
