const MockPublisher = require('./MockPublisher');
const InstagramPublisher = require('./InstagramPublisher');
const FacebookPublisher = require('./FacebookPublisher');
const LinkedInPublisher = require('./LinkedInPublisher');
const PinterestPublisher = require('./PinterestPublisher');
const YouTubePublisher = require('./YouTubePublisher');

class PublisherFactory {
  static getPublisher(platform) {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return new InstagramPublisher();
      case 'facebook':
        return new FacebookPublisher();
      case 'linkedin':
        return new LinkedInPublisher();
      case 'pinterest':
        return new PinterestPublisher();
      case 'youtube':
        return new YouTubePublisher();
      default:
        // For development, return mock publisher for all unsupported platforms
        return new MockPublisher(platform);
    }
  }
}

module.exports = PublisherFactory;
