const OAuthStrategy = require('./OAuthStrategy');

class MockPlatformStrategy extends OAuthStrategy {
  constructor(platformName) {
    super();
    this.platformName = platformName;
  }

  getAuthUrl(state) {
    // In production, this would be a real URL like https://www.facebook.com/v12.0/dialog/oauth?...
    // Here we redirect back to our own callback endpoint to mock the flow
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    return `${baseUrl}/api/oauth/callback/${this.platformName}?code=mock_auth_code_123&state=${state}`;
  }

  async handleCallback(code) {
    // Mock exchanging the code for an access token
    return {
      accessToken: `mock_access_token_for_${this.platformName}`,
      refreshToken: `mock_refresh_token_for_${this.platformName}`,
      externalAccountId: `ext_${Math.floor(Math.random() * 1000000)}`,
      profileName: `Mock ${this.platformName} User`,
      tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days
    };
  }
}

module.exports = MockPlatformStrategy;
