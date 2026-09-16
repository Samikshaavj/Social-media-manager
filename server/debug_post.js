const mongoose = require('mongoose');
const SocialAccount = require('./src/models/SocialAccount');
const Post = require('./src/models/Post');
const Publication = require('./src/models/Publication');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const pub = await Publication.findById('6aaa8e1ed8f885abcd705e30');
  const post = await Post.findById(pub.postId);
  const account = await SocialAccount.findById(pub.socialAccountId);
  
  const FacebookPublisher = require('./src/services/publisher/FacebookPublisher');
  process.env.FACEBOOK_REDIRECT_URI = 'https://social-media-manager-nld2.onrender.com/api/oauth/callback/facebook';
  
  const publisher = new FacebookPublisher();
  
  try {
    console.log('Trying to re-publish...');
    const result = await publisher.publish(pub, post.globalContent, post.globalMedia, account.accessToken);
    console.log('Success!', result);
  } catch (error) {
    console.error('Publishing failed:');
    console.error(error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
  
  process.exit(0);
}

run();
