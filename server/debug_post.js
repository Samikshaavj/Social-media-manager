const mongoose = require('mongoose');
const SocialAccount = require('./src/models/SocialAccount');
const Post = require('./src/models/Post');
const Publication = require('./src/models/Publication');
const InstagramPublisher = require('./src/services/publisher/InstagramPublisher');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find recent publications
  const pub = await Publication.findOne({ platform: 'Instagram' }).sort({ createdAt: -1 });
  if (!pub) return console.log('No pub');
  
  const account = await SocialAccount.findById(pub.socialAccountId);
  
  try {
    const axios = require('axios');
    const res = await axios.get(`https://graph.facebook.com/v20.0/${pub.externalPostId}?fields=id,media_product_type,media_type,permalink,shortcode&access_token=${account.accessToken}`);
    console.log('Facebook API response:', JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.error('FB API error:', e.response?.data || e.message);
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
