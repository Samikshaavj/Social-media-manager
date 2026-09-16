const PublisherStrategy = require('./PublisherStrategy');

class MockPublisher extends PublisherStrategy {
  constructor(platformName) {
    super();
    this.platformName = platformName;
  }

  async publish(publication, postContent, mediaAssets, accessToken) {
    console.log(`[MOCK PUBLISHER] Initiating publish to ${this.platformName}...`);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate an API error randomly (10% chance)
    if (Math.random() < 0.1) {
      throw new Error(`Simulated API error from ${this.platformName}`);
    }

    console.log(`[MOCK PUBLISHER] Successfully published to ${this.platformName}!`);
    
    return {
      success: true,
      externalPostId: `ext_post_${Math.floor(Math.random() * 1000000)}`,
      publishedAt: new Date(),
    };
  }
}

module.exports = MockPublisher;
