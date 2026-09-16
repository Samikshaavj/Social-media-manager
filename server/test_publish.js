require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Post = require('./src/models/Post');
const Publication = require('./src/models/Publication');
const SocialAccount = require('./src/models/SocialAccount');
const PublisherFactory = require('./src/services/publisher');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const readyPosts = await Post.find().sort({createdAt: -1}).limit(2);
    
    for (const post of readyPosts) {
      console.log(`Processing post ${post._id} with status ${post.status}`);
      const publications = await Publication.find({ postId: post._id });
      console.log(`Found ${publications.length} publications for post.`);

      for (const pub of publications) {
        try {
          console.log(`Publishing to ${pub.platform}...`);
          const account = await SocialAccount.findOne({ userId: post.userId, platform: pub.platform });
          const accessToken = account ? account.accessToken : 'mock_token';
          console.log(`Using access token: ${accessToken.substring(0, 10)}...`);

          const publisher = PublisherFactory.getPublisher(pub.platform);
          console.log(`Got publisher: ${publisher.constructor.name}`);
          
          console.log(`Calling publish with mediaAssets:`, post.mediaAssets);
          const result = await publisher.publish(pub, post.globalContent, post.mediaAssets, accessToken);
          
          console.log('Publish result:', result);
        } catch (err) {
          console.error(`Error publishing to ${pub.platform}:`, err.message);
        }
      }
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("DB error:", err);
    process.exit(1);
  });
