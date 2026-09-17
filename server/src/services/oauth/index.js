const MockPlatformStrategy = require('./MockStrategy');
const InstagramStrategy = require('./InstagramStrategy');
const FacebookStrategy = require('./FacebookStrategy');
const LinkedInStrategy = require('./LinkedInStrategy');
const PinterestStrategy = require('./PinterestStrategy');
const YouTubeStrategy = require('./YouTubeStrategy');

class OAuthFactory {
  static getStrategy(platform) {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return new InstagramStrategy();
      case 'facebook':
        return new FacebookStrategy();
      case 'linkedin':
        return new LinkedInStrategy();
      case 'pinterest':
        return new PinterestStrategy();
      case 'youtube':
        return new YouTubeStrategy();
      default:
        // For development, we return the mock strategy for all unsupported platforms
        return new MockPlatformStrategy(platform);
    }
  }
}

module.exports = OAuthFactory;
