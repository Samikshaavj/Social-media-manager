const InstagramAnalytics = require('./InstagramAnalytics');
const FacebookAnalytics = require('./FacebookAnalytics');
const YouTubeAnalytics = require('./YouTubeAnalytics');
const LinkedInAnalytics = require('./LinkedInAnalytics');
const PinterestAnalytics = require('./PinterestAnalytics');
const MockAnalytics = require('./MockAnalytics');

class AnalyticsFactory {
  static getAnalytics(platform) {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return new InstagramAnalytics();
      case 'facebook':
        return new FacebookAnalytics();
      case 'youtube':
        return new YouTubeAnalytics();
      case 'linkedin':
        return new LinkedInAnalytics();
      case 'pinterest':
        return new PinterestAnalytics();
      default:
        return new MockAnalytics(platform || 'General');
    }
  }
}

module.exports = AnalyticsFactory;
