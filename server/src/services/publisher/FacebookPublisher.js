const axios = require('axios');
const PublisherStrategy = require('./PublisherStrategy');
const SocialAccount = require('../../models/SocialAccount');
const MediaAsset = require('../../models/MediaAsset');

class FacebookPublisher extends PublisherStrategy {
  async publish(publication, postContent, mediaAssets, accessToken) {
    if (!mediaAssets || mediaAssets.length === 0) {
      throw new Error('Facebook publishing via this app requires at least one media asset.');
    }

    // Get the social account to find the externalAccountId (Facebook Page ID)
    const account = await SocialAccount.findById(publication.socialAccountId);
    if (!account || !account.externalAccountId) {
      throw new Error('Could not find connected Facebook Page details.');
    }

    const pageId = account.externalAccountId;
    
    // We only support single image/video for now
    const mediaId = mediaAssets[0];
    const asset = await MediaAsset.findById(mediaId);
    if (!asset) {
      throw new Error('Media asset not found in database.');
    }

    // Resolve public URL for Facebook to download
    let baseUrl = 'http://localhost:5000';
    if (process.env.NODE_ENV === 'production') {
      baseUrl = process.env.FACEBOOK_REDIRECT_URI ? new URL(process.env.FACEBOOK_REDIRECT_URI).origin : 'https://social-media-manager-nld2.onrender.com';
    } else {
      if (process.env.FACEBOOK_REDIRECT_URI) {
        baseUrl = process.env.FACEBOOK_REDIRECT_URI.replace(/\/api\/oauth\/callback\/facebook$/, '');
      } else if (process.env.INSTAGRAM_REDIRECT_URI) {
        baseUrl = process.env.INSTAGRAM_REDIRECT_URI.replace(/\/api\/oauth\/callback\/instagram$/, '');
      } else if (process.env.NGROK_URL) {
        baseUrl = process.env.NGROK_URL;
      }
    }
    const mediaUrl = `${baseUrl}${asset.url}`;

    try {
      let endpoint = `https://graph.facebook.com/v20.0/${pageId}/photos`;
      let body = {
        message: postContent,
        access_token: accessToken,
        url: mediaUrl
      };

      if (asset.type === 'VIDEO') {
        endpoint = `https://graph.facebook.com/v20.0/${pageId}/videos`;
        body = {
          description: postContent, // Videos use 'description' instead of 'message'
          access_token: accessToken,
          file_url: mediaUrl // Videos use 'file_url'
        };
      }

      console.log('--- FB DEBUG INFO ---');
      console.log('Endpoint:', endpoint);
      console.log('mediaUrl:', mediaUrl);
      console.log('---------------------');

      const response = await axios.post(endpoint, body);

      if (!response.data.id) {
        throw new Error('Failed to publish to Facebook Page.');
      }

      return {
        externalPostId: response.data.id
      };
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Facebook API Error:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }
}

module.exports = FacebookPublisher;
