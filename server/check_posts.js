const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/samik/Desktop/Social/Social/server/.env' });
const Post = require('./src/models/Post');
const Publication = require('./src/models/Publication');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
    console.log("RECENT POSTS:");
    posts.forEach(p => console.log(`Post ${p._id}: status=${p.status}`));

    const pubs = await Publication.find().sort({ createdAt: -1 }).limit(5);
    console.log("RECENT PUBLICATIONS:");
    pubs.forEach(p => console.log(`Pub ${p._id}: status=${p.status}, errorDetails=${p.errorDetails}`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
