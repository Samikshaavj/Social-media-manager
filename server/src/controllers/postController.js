const Post = require('../models/Post');
const Publication = require('../models/Publication');

// @desc    Create a new global post and its platform publications
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { globalContent, platforms, scheduledFor, timezone, mediaAssets } = req.body;

    if (!globalContent || !platforms || platforms.length === 0) {
      res.status(400);
      throw new Error('Please provide content and select at least one platform');
    }

    // Create the parent Post
    const post = await Post.create({
      userId: req.user.id,
      globalContent,
      globalMedia: mediaAssets || [],
      status: 'SCHEDULED', // Always SCHEDULED
      scheduledFor,
      timezone,
    });

    // Create a Publication for each selected platform
    const publications = [];
    for (const platform of platforms) {
      // Find the user's connected social account for this platform
      const account = await require('../models/SocialAccount').findOne({
        userId: req.user.id,
        platform: platform.toLowerCase()
      });

      if (!account) {
        throw new Error(`You have not connected a ${platform} account yet.`);
      }

      const pub = await Publication.create({
        postId: post._id,
        socialAccountId: account._id, 
        platform,
        status: 'SCHEDULED', // Always SCHEDULED so the worker picks it up
      });
      publications.push(pub);
    }

    res.status(201).json({
      post,
      publications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's posts
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res, next) => {
  try {
    // Fetch posts and populate their publications
    const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    // This is a basic implementation. In reality, you'd aggregate or run parallel queries 
    // to attach publications to each post in the response.
    const result = await Promise.all(posts.map(async (post) => {
      const publications = await Publication.find({ postId: post._id });
      return {
        ...post._doc,
        publications
      };
    }));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
};
