const axios = require('axios');
const OAuthStrategy = require('./OAuthStrategy');

class FacebookStrategy extends OAuthStrategy {
  constructor() {
    super();
    this.clientId = process.env.INSTAGRAM_CLIENT_ID; // Reuse the same Facebook App credentials
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    // We expect the user to configure FACEBOOK_REDIRECT_URI in Render (e.g. https://domain.com/api/oauth/callback/facebook)
    this.redirectUri = process.env.FACEBOOK_REDIRECT_URI || (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace('5173', '5000') + '/api/oauth/callback/facebook' : 'http://localhost:5000/api/oauth/callback/facebook');
  }

  getAuthUrl(state) {
    // For publishing to a Facebook Page, we need pages_manage_posts, pages_read_engagement, and pages_show_list
    const scopes = [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_show_list'
    ].join(',');
    
    return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}&scope=${scopes}`;
  }

  async handleCallback(code) {
    try {
      // 1. Exchange code for short-lived access token
      const tokenResponse = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
        params: {
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          client_secret: this.clientSecret,
          code: code
        }
      });
      
      let accessToken = tokenResponse.data.access_token;
      
      // 2. Exchange short-lived token for long-lived token
      const longLivedResponse = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          fb_exchange_token: accessToken
        }
      });
      
      accessToken = longLivedResponse.data.access_token;
      // expires_in is in seconds
      const expiresIn = longLivedResponse.data.expires_in || (60 * 60 * 24 * 60); // Default to 60 days if missing
      const tokenExpiresAt = new Date(Date.now() + (expiresIn * 1000));
      
      // 3. Get User's Pages to find a Page ID to publish to
      const pagesResponse = await axios.get(`https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`);
      const pages = pagesResponse.data.data;
      
      if (!pages || pages.length === 0) {
        throw new Error('No Facebook Pages found. You must manage a Facebook Page to publish.');
      }
      
      // We will default to connecting the first Facebook Page found.
      const primaryPage = pages[0];
      const pageId = primaryPage.id;
      const pageName = primaryPage.name;
      // Facebook Graph API requires a specific PAGE Access Token to publish to a page.
      // me/accounts returns the access_token for each page!
      const pageAccessToken = primaryPage.access_token;
      
      return {
        accessToken: pageAccessToken,
        refreshToken: accessToken, // We'll store the User long-lived token here just in case
        tokenExpiresAt,
        externalAccountId: pageId,
        profileName: pageName,
      };
      
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Facebook OAuth API Error:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }
}

module.exports = FacebookStrategy;
