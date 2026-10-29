const Post = require('../models/Post');
const Publication = require('../models/Publication');
const SocialAccount = require('../models/SocialAccount');

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

    const isDraft = req.body.status === 'DRAFT';
    const postStatus = isDraft ? 'DRAFT' : 'SCHEDULED';
    const scheduleDate = isDraft ? null : (scheduledFor ? new Date(scheduledFor) : new Date());

    // Create the parent Post
    const post = await Post.create({
      userId: req.user.id,
      globalContent,
      globalMedia: mediaAssets || [],
      status: postStatus,
      scheduledFor: scheduleDate,
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // Create a Publication for each selected platform
    const publications = [];
    for (const rawPlatform of platforms) {
      // Normalize platform name to match enum: 'Instagram', 'YouTube', etc.
      const platform = rawPlatform.charAt(0).toUpperCase() + rawPlatform.slice(1);

      // Find the user's connected social account for this platform
      let account = await SocialAccount.findOne({
        userId: req.user.id,
        platform: { $regex: new RegExp(`^${platform}$`, 'i') }
      });

      // If user hasn't connected this account yet and it's not a draft,
      // create a demo connected account so scheduling works seamlessly
      if (!account && !isDraft) {
        try {
          account = await SocialAccount.create({
            userId: req.user.id,
            platform,
            externalAccountId: `demo_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            accessToken: 'mock_demo_token',
            profileName: `Demo ${platform} User`,
            status: 'CONNECTED',
          });
        } catch (accErr) {
          console.warn(`Could not auto-create demo social account for ${platform}:`, accErr.message);
        }
      }

      if (account) {
        const pub = await Publication.create({
          postId: post._id,
          socialAccountId: account._id, 
          platform,
          status: postStatus,
        });
        publications.push(pub);
      }
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
    // Fetch posts and populate their publications and media
    const posts = await Post.find({ userId: req.user.id })
      .populate('globalMedia')
      .sort({ createdAt: -1 });
    
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
