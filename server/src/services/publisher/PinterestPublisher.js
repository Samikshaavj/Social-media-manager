const axios = require('axios');
const PublisherStrategy = require('./PublisherStrategy');
const SocialAccount = require('../../models/SocialAccount');
const MediaAsset = require('../../models/MediaAsset');

class PinterestPublisher extends PublisherStrategy {
  async publish(publication, postContent, mediaAssets, accessToken) {
    if (!mediaAssets || mediaAssets.length === 0) {
      throw new Error('Pinterest publishing requires at least one media asset (image).');
    }

    const account = await SocialAccount.findById(publication.socialAccountId);
    if (!account) {
      throw new Error('Could not find connected Pinterest account details.');
    }

    // Get the first asset
    const mediaId = mediaAssets[0];
    const asset = await MediaAsset.findById(mediaId);
    if (!asset) {
      throw new Error('Media asset not found in database.');
    }
    
    if (asset.type === 'VIDEO') {
      throw new Error('Video uploads are not yet supported for Pinterest via this app.');
    }

    // Determine public URL for Pinterest to download
    let baseUrl = 'http://localhost:5000';
    if (process.env.NODE_ENV === 'production') {
      baseUrl = process.env.PINTEREST_REDIRECT_URI 
        ? new URL(process.env.PINTEREST_REDIRECT_URI).origin 
        : 'https://social-media-manager-nld2.onrender.com';
    } else {
      if (process.env.NGROK_URL) {
        baseUrl = process.env.NGROK_URL;
      } else if (process.env.FACEBOOK_REDIRECT_URI) {
        baseUrl = process.env.FACEBOOK_REDIRECT_URI.replace(/\/api\/oauth\/callback\/facebook$/, '');
      }
    }
    const mediaUrl = `${baseUrl}${asset.url}`;

    try {
      // 1. Fetch user's boards
      const boardsResponse = await axios.get('https://api.pinterest.com/v5/boards', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      let boardId = null;
      let boards = boardsResponse.data.items || [];
      
      if (boards.length === 0) {
        // 2. No boards exist, create a default one
        const newBoardResponse = await axios.post('https://api.pinterest.com/v5/boards', {
          name: 'Social Media Manager',
          description: 'Posts managed by Social Media Manager app',
          privacy: 'PUBLIC' // Can be PUBLIC or SECRET
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        boardId = newBoardResponse.data.id;
      } else {
        boardId = boards[0].id;
      }

      // 3. Post the Pin
      const pinBody = {
        board_id: boardId,
        media_source: {
          source_type: 'image_url',
          url: mediaUrl
        },
        title: postContent.substring(0, 100), // Pinterest requires a title or derives it, but let's provide a safe substring
        description: postContent
      };

      const response = await axios.post('https://api.pinterest.com/v5/pins', pinBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        externalPostId: response.data.id,
        url: `https://www.pinterest.com/pin/${response.data.id}/`
      };

    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Pinterest API Error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Pinterest API Error:', error.message);
      }
      throw error;
    }
  }
}

module.exports = PinterestPublisher;
