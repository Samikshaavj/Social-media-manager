class AnalyticsStrategy {
  async fetchAccountMetrics(account) {
    throw new Error('fetchAccountMetrics() must be implemented.');
  }

  async fetchPostMetrics(publication, account) {
    throw new Error('fetchPostMetrics() must be implemented.');
  }
}

module.exports = AnalyticsStrategy;
