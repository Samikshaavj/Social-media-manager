const MockPublisher = require('./MockPublisher');
const InstagramPublisher = require('./InstagramPublisher');
const FacebookPublisher = require('./FacebookPublisher');
const LinkedInPublisher = require('./LinkedInPublisher');

class PublisherFactory {
  static getPublisher(platform) {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return new InstagramPublisher();
      case 'facebook':
        return new FacebookPublisher();
      case 'linkedin':
        return new LinkedInPublisher();
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
