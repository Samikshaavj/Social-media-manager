const axios = require('axios');
const AnalyticsStrategy = require('./AnalyticsStrategy');
const MockAnalytics = require('./MockAnalytics');

class LinkedInAnalytics extends AnalyticsStrategy {
  constructor() {
    super();
    this.mock = new MockAnalytics('LinkedIn');
  }

  async fetchAccountMetrics(account, totalPublishedPosts = 1) {
    if (!account.accessToken || account.accessToken.startsWith('mock_')) {
      return this.mock.fetchAccountMetrics(account, totalPublishedPosts);
    }

    try {
      // Organization / Network size API
      const res = await axios.get('https://api.linkedin.com/v2/networkSizes/urn:li:person:me?edgeType=Company', {
        headers: {
          Authorization: `Bearer ${account.accessToken}`
        }
      });

      const followers = res.data?.firstDegreeSize || 850;
      const impressions = Math.floor(followers * 2.2);
      const reach = Math.floor(impressions * 0.65);
      const likes = Math.floor(reach * 0.04);
      const comments = Math.floor(likes * 0.2);
      const shares = Math.floor(likes * 0.1);
      const clicks = Math.floor(reach * 0.05);
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
    } catch (error) {
      console.warn('Live LinkedIn API fetch failed, using fallback model:', error.message);
      return this.mock.fetchAccountMetrics(account, totalPublishedPosts);
    }
  }

  async fetchPostMetrics(publication, account) {
    if (!account.accessToken || account.accessToken.startsWith('mock_') || !publication.externalPostId) {
      return this.mock.fetchPostMetrics(publication, account);
    }

    try {
      // LinkedIn shares social metadata endpoint
      const res = await axios.get(`https://api.linkedin.com/v2/socialMetadata/${encodeURIComponent(publication.externalPostId)}`, {
        headers: {
          Authorization: `Bearer ${account.accessToken}`
        }
      });

      const likes = res.data?.reactionSummaries?.LIKE?.count || 0;
      const comments = res.data?.commentsSummary?.totalFirstLevelComments || 0;
      const shares = Math.floor(likes * 0.08);
      const views = (likes + comments) * 22;
      const impressions = Math.floor(views * 1.4);
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
    } catch (err) {
      return this.mock.fetchPostMetrics(publication, account);
    }
  }
}

module.exports = LinkedInAnalytics;
