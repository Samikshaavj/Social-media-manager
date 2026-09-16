const cron = require('node-cron');
const Post = require('../models/Post');
const Publication = require('../models/Publication');
const SocialAccount = require('../models/SocialAccount');
const PublisherFactory = require('../services/publisher');

// Run every minute
const initPublisherWorker = () => {
  console.log('[WORKER] Publisher cron job initialized (running every minute)');
  
  cron.schedule('* * * * *', async () => {
    console.log(`[WORKER] Checking for scheduled posts at ${new Date().toISOString()}...`);
    
    try {
      // Find posts that are scheduled and the time has passed or is now
      // Note: In Phase 4 we defaulted non-scheduled posts to 'DRAFT'. 
      // For immediate posts, we should have a 'READY' status, or we can just process all 'SCHEDULED' posts.
      // If a user clicks "Publish Now", the controller should probably set status to 'SCHEDULED' with Date.now().
      // Let's find all posts that are SCHEDULED and ready to go out.
      
      const now = new Date();
      const readyPosts = await Post.find({
        status: 'SCHEDULED',
        $or: [
          { scheduledFor: { $lte: now } },
          { scheduledFor: null } // Handle immediate publish if null but marked SCHEDULED
        ]
      });

      if (readyPosts.length === 0) {
        return;
      }

      console.log(`[WORKER] Found ${readyPosts.length} posts ready to publish.`);

      for (const post of readyPosts) {
        // Mark post as PUBLISHING
        post.status = 'PUBLISHING';
        await post.save();

        const publications = await Publication.find({ postId: post._id });
        let allSuccess = true;

        for (const pub of publications) {
          try {
            pub.status = 'PUBLISHING';
            await pub.save();

            // Note: We need the user's access token for this platform.
            const account = await SocialAccount.findOne({ userId: post.userId, platform: pub.platform.toLowerCase() });
            const accessToken = account ? account.accessToken : 'mock_token';

            const publisher = PublisherFactory.getPublisher(pub.platform);
            const result = await publisher.publish(pub, post.globalContent, post.globalMedia, accessToken);

            pub.status = 'PUBLISHED';
            pub.externalPostId = result.externalPostId;
            await pub.save();

          } catch (error) {
            console.error(`[WORKER] Failed to publish to ${pub.platform}:`, error.message);
            pub.status = 'FAILED';
            pub.errorDetails = error.message;
            await pub.save();
            allSuccess = false;
          }
        }

        // Update parent post status
        post.status = allSuccess ? 'PUBLISHED' : 'FAILED'; // Could be PARTIAL_SUCCESS in real app
        await post.save();
      }

    } catch (error) {
      console.error('[WORKER] Error in publisher cron job:', error);
    }
  });
};

module.exports = initPublisherWorker;
