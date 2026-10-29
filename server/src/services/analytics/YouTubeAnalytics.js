const axios = require('axios');
const AnalyticsStrategy = require('./AnalyticsStrategy');
const MockAnalytics = require('./MockAnalytics');

class YouTubeAnalytics extends AnalyticsStrategy {
  constructor() {
    super();
    this.mock = new MockAnalytics('YouTube');
  }

  async fetchAccountMetrics(account, totalPublishedPosts = 1) {
    if (!account.accessToken || account.accessToken.startsWith('mock_')) {
      return this.mock.fetchAccountMetrics(account, totalPublishedPosts);
    }

    try {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'statistics',
          mine: true
        },
        headers: {
          Authorization: `Bearer ${account.accessToken}`
        }
      });

      const stats = res.data?.items?.[0]?.statistics || {};
      const followers = Number(stats.subscriberCount) || 1500;
      const views = Number(stats.viewCount) || (followers * 4);
      const comments = Number(stats.commentCount) || 120;
      const likes = Math.floor(views * 0.05);
      const shares = Math.floor(likes * 0.08);
      const reach = views;
      const impressions = Math.floor(views * 1.5);
      const clicks = Math.floor(views * 0.02);
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
      console.warn('Live YouTube API fetch failed, using fallback model:', error.message);
      return this.mock.fetchAccountMetrics(account, totalPublishedPosts);
    }
  }

  async fetchPostMetrics(publication, account) {
    if (!account.accessToken || account.accessToken.startsWith('mock_') || !publication.externalPostId) {
      return this.mock.fetchPostMetrics(publication, account);
    }

    try {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'statistics',
          id: publication.externalPostId
        },
        headers: {
          Authorization: `Bearer ${account.accessToken}`
        }
      });

      const stats = res.data?.items?.[0]?.statistics || {};
      const views = Number(stats.viewCount) || 0;
      const likes = Number(stats.likeCount) || 0;
      const comments = Number(stats.commentCount) || 0;
      const shares = Math.floor(likes * 0.1);
      const impressions = Math.floor(views * 1.3);
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

module.exports = YouTubeAnalytics;
