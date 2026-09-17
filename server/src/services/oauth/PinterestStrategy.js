const axios = require('axios');
const OAuthStrategy = require('./OAuthStrategy');

class PinterestStrategy extends OAuthStrategy {
  constructor() {
    super();
    this.clientId = process.env.PINTEREST_CLIENT_ID;
    this.clientSecret = process.env.PINTEREST_CLIENT_SECRET;
    this.redirectUri = process.env.PINTEREST_REDIRECT_URI || 'http://localhost:5000/api/oauth/callback/pinterest';
    
    if (process.env.NODE_ENV === 'production' && !process.env.PINTEREST_REDIRECT_URI) {
      this.redirectUri = 'https://social-media-manager-nld2.onrender.com/api/oauth/callback/pinterest';
    }
  }

  getAuthUrl(state) {
    const scopes = ['boards:read', 'boards:write', 'pins:read', 'pins:write', 'user_accounts:read'];
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state,
      scope: scopes.join(',') // Pinterest uses comma-separated scopes
    });

    return `https://www.pinterest.com/oauth/?${params.toString()}`;
  }

  async handleCallback(code) {
    // 1. Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
    });

    // Pinterest requires Basic Auth for token exchange
    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const tokenResponse = await axios.post('https://api.pinterest.com/v5/oauth/token', tokenParams.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`
      }
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // 2. Get user profile
    const profileResponse = await axios.get('https://api.pinterest.com/v5/user_account', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const profile = profileResponse.data;

    // Calculate expiration date
    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

    return {
      accessToken: access_token,
      refreshToken: refresh_token || null,
      tokenExpiresAt,
      externalAccountId: profile.username, // Using username as external ID
      profileName: profile.username || 'Pinterest User',
    };
  }
}

module.exports = PinterestStrategy;
