const axios = require('axios');
const PublisherStrategy = require('./PublisherStrategy');
const SocialAccount = require('../../models/SocialAccount');
const MediaAsset = require('../../models/MediaAsset');

class InstagramPublisher extends PublisherStrategy {
  async publish(publication, postContent, mediaAssets, accessToken) {
    if (!mediaAssets || mediaAssets.length === 0) {
      throw new Error('Instagram requires at least one media asset (image or video) to publish.');
    }

    // Get the social account to find the externalAccountId (ig-user-id)
    const account = await SocialAccount.findById(publication.socialAccountId);
    if (!account || !account.externalAccountId) {
      throw new Error('Could not find connected Instagram account details.');
    }

    const igUserId = account.externalAccountId;
    
    // We only support single image/video for now
    const mediaId = mediaAssets[0];
    const asset = await MediaAsset.findById(mediaId);
    if (!asset) {
      throw new Error('Media asset not found in database.');
    }

    // The asset URL is currently a local path (e.g., /uploads/filename.jpg)
    let baseUrl = 'http://localhost:5000';
    if (process.env.NODE_ENV === 'production') {
      baseUrl = process.env.INSTAGRAM_REDIRECT_URI ? new URL(process.env.INSTAGRAM_REDIRECT_URI).origin : 'https://social-media-manager-nld2.onrender.com';
    } else {
      if (process.env.INSTAGRAM_REDIRECT_URI) {
        baseUrl = process.env.INSTAGRAM_REDIRECT_URI.replace(/\/api\/oauth\/callback\/instagram$/, '');
      } else if (process.env.FACEBOOK_REDIRECT_URI) {
        baseUrl = process.env.FACEBOOK_REDIRECT_URI.replace(/\/api\/oauth\/callback\/facebook$/, '');
      } else if (process.env.NGROK_URL) {
        baseUrl = process.env.NGROK_URL;
      }
    }
    const mediaUrl = `${baseUrl}${asset.url}`;

    try {
      // Step 1: Create Media Container
      const containerParams = {
        caption: postContent,
        access_token: accessToken,
      };

      if (asset.type === 'VIDEO') {
        containerParams.media_type = 'VIDEO';
        containerParams.video_url = mediaUrl;
      } else {
        containerParams.image_url = mediaUrl;
      }

      console.log('--- DEBUG INFO ---');
      console.log('asset:', asset);
      console.log('mediaUrl:', mediaUrl);
      console.log('------------------');

      const containerResponse = await axios.post(`https://graph.facebook.com/v20.0/${igUserId}/media`, null, {
        params: containerParams
      });

      const containerId = containerResponse.data.id;
      if (!containerId) {
        throw new Error('Failed to create Instagram media container.');
      }

      // Wait a brief moment to allow Facebook to process the container (especially for videos)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 2: Publish the Container
      const publishResponse = await axios.post(`https://graph.facebook.com/v20.0/${igUserId}/media_publish`, null, {
        params: {
          creation_id: containerId,
          access_token: accessToken,
        }
      });

      if (!publishResponse.data.id) {
        throw new Error('Failed to publish Instagram media container.');
      }

      return {
        externalPostId: publishResponse.data.id
      };
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Instagram API Error:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }
}

module.exports = InstagramPublisher;
