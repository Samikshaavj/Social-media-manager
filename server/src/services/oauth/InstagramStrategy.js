const OAuthStrategy = require('./OAuthStrategy');
const axios = require('axios');

class InstagramStrategy extends OAuthStrategy {
  getAuthUrl(state) {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
    
    const scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement',
      'business_management'
    ].join(',');

    // Using Facebook Login for Instagram Graph API with rerequest
    return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}&auth_type=rerequest`;
  }

  async handleCallback(code) {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    try {
      // 1. Exchange code for short-lived user access token
      const tokenResponse = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token`, {
        params: {
          client_id: clientId,
          redirect_uri: redirectUri,
          client_secret: clientSecret,
          code: code
        }
      });
      
      let accessToken = tokenResponse.data.access_token;

      // 2. Exchange short-lived token for long-lived user access token
      const longLivedTokenResponse = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: clientId,
          client_secret: clientSecret,
          fb_exchange_token: accessToken
        }
      });

      accessToken = longLivedTokenResponse.data.access_token;
      // expires_in is usually ~60 days (5184000 seconds)
      const expiresIn = longLivedTokenResponse.data.expires_in || 5184000;
      const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

      // Debug permissions
      try {
        const perms = await axios.get(`https://graph.facebook.com/v20.0/me/permissions`, { params: { access_token: accessToken } });
        console.log('Granted Permissions:', JSON.stringify(perms.data, null, 2));
      } catch (e) {
        console.log('Failed to fetch permissions');
      }

      // 3. Get user's Facebook Pages
      const pagesResponse = await axios.get(`https://graph.facebook.com/v20.0/me/accounts`, {
        params: { access_token: accessToken }
      });

      const pages = pagesResponse.data.data;
      console.log('Facebook Pages Response:', JSON.stringify(pagesResponse.data, null, 2));
      
      if (!pages || pages.length === 0) {
        throw new Error('No Facebook Pages found. You must have a Facebook Page linked to your Instagram Professional Account.');
      }

      // 4. Find the connected Instagram Business Account
      let igAccountId = null;
      let pageAccessToken = null;

      for (const page of pages) {
        try {
          const igAccountResponse = await axios.get(`https://graph.facebook.com/v20.0/${page.id}`, {
            params: {
              fields: 'instagram_business_account',
              access_token: page.access_token // Use the Page Access Token for this request
            }
          });

          if (igAccountResponse.data.instagram_business_account) {
            igAccountId = igAccountResponse.data.instagram_business_account.id;
            pageAccessToken = page.access_token; // Keep track of the page token if needed for publishing
            break;
          }
        } catch (err) {
          // Ignore and check next page
          console.warn(`Could not fetch IG account for page ${page.id}:`, err.response?.data || err.message);
        }
      }

      if (!igAccountId) {
        throw new Error('No linked Instagram Professional Account found on your Facebook Pages.');
      }

      // 5. Get Instagram Profile details
      const profileResponse = await axios.get(`https://graph.facebook.com/v20.0/${igAccountId}`, {
        params: {
          fields: 'username,name,profile_picture_url',
          access_token: accessToken
        }
      });

      const profile = profileResponse.data;

      return {
        accessToken: accessToken,
        refreshToken: pageAccessToken, // Storing pageAccessToken here as we might need it for publishing
        tokenExpiresAt: tokenExpiresAt,
        externalAccountId: igAccountId,
        profileName: profile.username || profile.name || 'Instagram Account',
      };

    } catch (error) {
      console.error('Instagram OAuth Error:', JSON.stringify(error.response?.data || error.message, null, 2));
      throw error;
    }
  }
}

module.exports = InstagramStrategy;
