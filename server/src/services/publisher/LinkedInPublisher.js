const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PublisherStrategy = require('./PublisherStrategy');
const SocialAccount = require('../../models/SocialAccount');
const MediaAsset = require('../../models/MediaAsset');

class LinkedInPublisher extends PublisherStrategy {
  constructor() {
    super();
    this.baseUrl = 'http://localhost:5000';
    if (process.env.NODE_ENV === 'production') {
      this.baseUrl = 'https://social-media-manager-nld2.onrender.com';
    }
  }

  async publish(publication, postContent, mediaAssets, accessToken) {
    try {
      const account = await SocialAccount.findById(publication.socialAccountId);
      if (!account || !account.externalAccountId) {
        throw new Error('Could not find connected LinkedIn account details.');
      }
      const author = account.externalAccountId; // This is the URN urn:li:person:ID
      
      let specificContent = {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postContent
          },
          shareMediaCategory: 'NONE'
        }
      };

      if (mediaAssets && mediaAssets.length > 0) {
        const assetId = mediaAssets[0];
        const asset = await MediaAsset.findById(assetId);
        if (!asset) {
          throw new Error('Media asset not found in database.');
        }

        // LinkedIn requires 3 steps for media:
        // 1. Register Upload
        // 2. Upload the file
        // 3. Post

        // Determine media type
        const recipe = asset.type === 'VIDEO' 
          ? 'urn:li:digitalmediaRecipe:feedshare-video' 
          : 'urn:li:digitalmediaRecipe:feedshare-image';
          
        const mediaCategory = asset.type === 'VIDEO' ? 'VIDEO' : 'IMAGE';

        // 1. Register Upload
        const registerBody = {
          registerUploadRequest: {
            recipes: [recipe],
            owner: author,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
              }
            ]
          }
        };

        const registerResponse = await axios.post('https://api.linkedin.com/v2/assets?action=registerUpload', registerBody, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const assetUrn = registerResponse.data.value.asset;

        // 2. Upload file
        const filePath = path.join(__dirname, '../../../', asset.url);
        const fileData = fs.readFileSync(filePath);
        
        await axios.put(uploadUrl, fileData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream' 
          }
        });

        // 3. Prepare Post payload
        specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = mediaCategory;
        specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            description: { text: postContent }, 
            media: assetUrn,
            title: { text: 'Upload' }
          }
        ];
      }

      const postBody = {
        author: author,
        lifecycleState: 'PUBLISHED',
        specificContent,
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', postBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json'
        }
      });

      return {
        externalPostId: response.data.id,
        url: `https://www.linkedin.com/feed/update/${response.data.id}`
      };

    } catch (error) {
      console.error('LinkedIn Publisher Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = LinkedInPublisher;
