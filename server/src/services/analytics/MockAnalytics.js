const AnalyticsStrategy = require('./AnalyticsStrategy');

class MockAnalytics extends AnalyticsStrategy {
  constructor(platformName) {
    super();
    this.platformName = platformName;
  }

  async fetchAccountMetrics(account, totalPublishedPosts = 1) {
    // Platform-tailored follower base
    const baseMap = {
      Instagram: 18450,
      YouTube: 12200,
      Facebook: 9800,
      LinkedIn: 6400,
      Pinterest: 4950
    };

    const base = baseMap[this.platformName] || 5000;
    const postBoost = totalPublishedPosts * 180;
    const followers = base + postBoost;
    const impressions = Math.floor(followers * 1.85);
    const reach = Math.floor(impressions * 0.72);
    const likes = Math.floor(reach * 0.045);
    const comments = Math.floor(likes * 0.12);
    const shares = Math.floor(likes * 0.08);
    const clicks = Math.floor(reach * 0.025);
    const engagement = likes + comments + shares + clicks;

    return {
      followers,
      impressions,
      reach,
      engagement,
      likes,
      comments,
      shares,
      clicks,
    };
  }

  async fetchPostMetrics(publication, account) {
    const hoursOld = Math.max(1, (Date.now() - new Date(publication.createdAt).getTime()) / (1000 * 60 * 60));
    const factor = Math.min(hoursOld, 72); // Caps after 3 days

    const views = Math.floor(250 + (factor * 35));
    const impressions = Math.floor(views * 1.25);
    const likes = Math.floor(views * 0.065);
    const comments = Math.floor(likes * 0.15);
    const shares = Math.floor(likes * 0.05);
    const engagementRate = views > 0 ? Number((((likes + comments + shares) / views) * 100).toFixed(2)) : 0;

    return {
      views,
      impressions,
      likes,
      comments,
      shares,
      engagementRate,
      lastFetchedAt: new Date()
    };
  }
}

module.exports = MockAnalytics;
