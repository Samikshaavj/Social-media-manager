const mongoose = require('mongoose');
const SocialAccount = require('./src/models/SocialAccount');
const Post = require('./src/models/Post');
const Publication = require('./src/models/Publication');
const InstagramPublisher = require('./src/services/publisher/InstagramPublisher');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find failed Facebook publication
  const pub = await Publication.findOne({ platform: 'Facebook', status: 'FAILED' }).sort({ createdAt: -1 });
  if (!pub) return console.log('No failed Facebook pub found.');
  
  const post = await Post.findById(pub.postId);
  const account = await SocialAccount.findById(pub.socialAccountId);
  
  const FacebookPublisher = require('./src/services/publisher/FacebookPublisher');
  
  // Set the environment variable to Render just for this script
  process.env.FACEBOOK_REDIRECT_URI = 'https://social-media-manager-nld2.onrender.com/api/oauth/callback/facebook';
  
  const publisher = new FacebookPublisher();
  
  try {
    console.log('Trying to re-publish...');
    const result = await publisher.publish(pub, post.content, post.globalMedia, account.accessToken);
    console.log('Success!', result);
  } catch (error) {
    console.error('Publishing failed:');
    console.error(error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
  
  return;
  
  try {
    console.log('Attempting to publish post:', post._id);
    const baseUrl = process.env.INSTAGRAM_REDIRECT_URI.replace(/\/api\/oauth\/callback\/instagram$/, '');
    console.log('mediaUrl will be:', `${baseUrl}${post.globalMedia[0].url}`);
    const result = await publisher.publish(pub, post.globalContent, post.globalMedia, account.accessToken);
    console.log('Success:', result);
  } catch (error) {
    console.log('Publish failed.');
  }
  
  process.exit(0);
}

run();
