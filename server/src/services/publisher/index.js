const MockPublisher = require('./MockPublisher');

class PublisherFactory {
  static getPublisher(platform) {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return new (require('./InstagramPublisher'))();
      case 'facebook':
      case 'linkedin':
      case 'youtube':
      case 'pinterest':
        // For development, return mock publisher for all platforms
        return new MockPublisher(platform);
      default:
        throw new Error(`Platform ${platform} is not supported for publishing.`);
    }
  }
}

module.exports = PublisherFactory;
