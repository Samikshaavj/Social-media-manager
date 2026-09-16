class OAuthStrategy {
  getAuthUrl() {
    throw new Error('Method not implemented.');
  }

  async handleCallback(code) {
    throw new Error('Method not implemented.');
  }
}

module.exports = OAuthStrategy;
