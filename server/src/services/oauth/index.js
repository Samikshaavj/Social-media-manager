const MockPlatformStrategy = require('./MockStrategy');
const InstagramStrategy = require('./InstagramStrategy');
const FacebookStrategy = require('./FacebookStrategy');

class OAuthFactory {
  static getStrategy(platform) {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return new InstagramStrategy();
      case 'facebook':
        return new FacebookStrategy();
      case 'linkedin':
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
