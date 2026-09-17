const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PublisherStrategy = require('./PublisherStrategy');
const SocialAccount = require('../../models/SocialAccount');
const MediaAsset = require('../../models/MediaAsset');

class YouTubePublisher extends PublisherStrategy {
  async publish(publication, postContent, mediaAssets, accessToken) {
    if (!mediaAssets || mediaAssets.length === 0) {
      throw new Error('YouTube publishing requires exactly one video asset.');
    }

    const account = await SocialAccount.findById(publication.socialAccountId);
    if (!account) {
      throw new Error('Could not find connected YouTube account details.');
    }

    const mediaId = mediaAssets[0];
    const asset = await MediaAsset.findById(mediaId);
    if (!asset) {
      throw new Error('Media asset not found in database.');
    }
    
    if (asset.type !== 'VIDEO') {
      throw new Error('YouTube only accepts video uploads. Image uploads are not supported.');
    }

    // Determine the absolute local path to the video file
    // The asset.url is typically like '/uploads/filename.mp4'
    const fileName = path.basename(asset.url);
    const filePath = path.join(__dirname, '../../../uploads', fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Video file not found on server: ${filePath}`);
    }

    try {
      // 1. Initialize Resumable Upload Session
      const metadata = {
        snippet: {
          title: postContent.substring(0, 100) || 'My Video',
          description: postContent,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public', // public, private, or unlisted
          selfDeclaredMadeForKids: false
        }
      };

      const initResponse = await axios.post(
        'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
        metadata,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Upload-Content-Type': 'video/*',
            'X-Upload-Content-Length': fs.statSync(filePath).size
          }
        }
      );

      const uploadUrl = initResponse.headers.location;
      if (!uploadUrl) {
        throw new Error('Failed to get upload URL from YouTube API');
      }

      // 2. Upload the Video File
      const fileStream = fs.createReadStream(filePath);
      const fileSize = fs.statSync(filePath).size;

      const uploadResponse = await axios.put(uploadUrl, fileStream, {
        headers: {
          'Content-Type': 'video/*',
          'Content-Length': fileSize
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      return {
        externalPostId: uploadResponse.data.id,
        url: `https://www.youtube.com/watch?v=${uploadResponse.data.id}`
      };

    } catch (error) {
      if (error.response && error.response.data) {
        console.error('YouTube API Error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('YouTube API Error:', error.message);
      }
      throw error;
    }
  }
}

module.exports = YouTubePublisher;
