const axios = require('axios');
const OAuthStrategy = require('./OAuthStrategy');

class YouTubeStrategy extends OAuthStrategy {
  constructor() {
    super();
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/oauth/callback/youtube';
    
    if (process.env.NODE_ENV === 'production' && !process.env.GOOGLE_REDIRECT_URI) {
      this.redirectUri = 'https://social-media-manager-nld2.onrender.com/api/oauth/callback/youtube';
    }
  }

  getAuthUrl(state) {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      state: state,
      access_type: 'offline', // Required to get a refresh token
      prompt: 'consent'       // Force consent screen to ensure refresh token is returned
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleCallback(code) {
    // 1. Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // 2. Get user profile
    const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const profile = profileResponse.data;

    // Calculate expiration date
    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

    return {
      accessToken: access_token,
      refreshToken: refresh_token || null, // Might be undefined if not first auth and prompt=consent not used
      tokenExpiresAt,
      externalAccountId: profile.id, 
      profileName: profile.name || profile.email,
    };
  }
}

module.exports = YouTubeStrategy;
