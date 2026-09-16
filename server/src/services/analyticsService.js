const Post = require('../models/Post');

class AnalyticsService {
  async getDashboardStats(userId) {
    // Count real posts
    const postsCount = await Post.countDocuments({ userId, status: 'PUBLISHED' });
    
    // Generate deterministic fake stats based on post count
    const baseFollowers = 120000;
    const addedFollowers = postsCount * 250;
    
    return [
      { label: 'Total Followers', value: this.formatNumber(baseFollowers + addedFollowers), change: '+12%' },
      { label: 'Total Engagement', value: this.formatNumber(8000 + (postsCount * 150)), change: '+5%' },
      { label: 'Posts Published', value: this.formatNumber(postsCount), change: '+18%' },
      { label: 'Audience Reach', value: this.formatNumber(450000 + (postsCount * 5000)), change: '+22%' },
    ];
  }

  async getChartData(userId) {
    // Count real posts to add variance
    const postsCount = await Post.countDocuments({ userId, status: 'PUBLISHED' });
    const multiplier = 1 + (postsCount * 0.1);

    // Generate last 7 days of data
    const data = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Generate deterministic but pseudo-random looking data
    for (let i = 0; i < 7; i++) {
      data.push({
        name: days[i],
        Instagram: Math.floor((4000 + (i * 200)) * multiplier),
        LinkedIn: Math.floor((3000 + (i * 300) - (i%2*500)) * multiplier),
        Facebook: Math.floor((2000 + (i * 100)) * multiplier),
      });
    }
    
    return data;
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}

module.exports = new AnalyticsService();
