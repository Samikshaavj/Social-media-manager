const mongoose = require('mongoose');
const SocialAccount = require('./src/models/SocialAccount');
const Post = require('./src/models/Post');
const Publication = require('./src/models/Publication');
const InstagramPublisher = require('./src/services/publisher/InstagramPublisher');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find the latest failed publication
  const pub = await Publication.findOne({ platform: 'Instagram', status: 'FAILED' }).sort({ createdAt: -1 });
  if (!pub) {
    console.log('No failed publication found.');
    return;
  }
  
  const post = await Post.findById(pub.postId);
  const account = await SocialAccount.findOne({ userId: post.userId, platform: 'instagram' });
  
  if (!account) {
    console.log('Account not found');
    return;
  }

  const publisher = new InstagramPublisher();
  
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
