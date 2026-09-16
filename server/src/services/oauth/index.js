const MockPlatformStrategy = require('./MockStrategy');
const InstagramStrategy = require('./InstagramStrategy');
const FacebookStrategy = require('./FacebookStrategy');
const LinkedInStrategy = require('./LinkedInStrategy');

class OAuthFactory {
  static getStrategy(platform) {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return new InstagramStrategy();
      case 'facebook':
        return new FacebookStrategy();
      case 'linkedin':
        return new LinkedInStrategy();
      case 'youtube':
      case 'pinterest':
        // For development, we return the mock strategy for all platforms
        return new MockPlatformStrategy(platform);
      default:
        throw new Error(`Platform ${platform} is not supported.`);
    }
  }
}

module.exports = OAuthFactory;
