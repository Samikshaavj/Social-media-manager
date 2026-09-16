const axios = require('axios');
const OAuthStrategy = require('./OAuthStrategy');

class LinkedInStrategy extends OAuthStrategy {
  constructor() {
    super();
    this.clientId = process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    this.redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5000/api/oauth/callback/linkedin';
    
    // For LinkedIn, if in production, we should ensure the redirect URI matches Render
    if (process.env.NODE_ENV === 'production' && !process.env.LINKEDIN_REDIRECT_URI) {
      this.redirectUri = 'https://social-media-manager-nld2.onrender.com/api/oauth/callback/linkedin';
    }
  }

  getAuthUrl(state) {
    const scopes = ['openid', 'profile', 'w_member_social', 'email'];
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state,
      scope: scopes.join(' ')
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  async handleCallback(code) {
    // 1. Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });

    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', tokenParams.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = tokenResponse.data;

    // 2. Get user profile and URN
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const profile = profileResponse.data;
    const urn = `urn:li:person:${profile.sub}`;

    // Calculate expiration date
    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

    return {
      accessToken: access_token,
      refreshToken: null, // LinkedIn v2 doesn't always provide a refresh token without specific agreements
      tokenExpiresAt,
      externalAccountId: urn,
      profileName: `${profile.given_name} ${profile.family_name}`,
    };
  }
}

module.exports = LinkedInStrategy;
