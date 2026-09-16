const OAuthFactory = require('../services/oauth');
const SocialAccount = require('../models/SocialAccount');
const jwt = require('jsonwebtoken');

// @desc    Initiate OAuth flow
// @route   GET /api/oauth/connect/:platform
// @access  Private (but accessed via redirect, so we pass token in query)
const connectPlatform = async (req, res, next) => {
  try {
    const { platform } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(401).send('Not authorized');
    }

    // Verify token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev');
    const userId = decoded.id;

    // Use JWT as state to pass userId through the OAuth flow
    const state = jwt.sign({ userId, platform }, process.env.JWT_SECRET || 'fallback_secret_for_dev', { expiresIn: '15m' });

    const strategy = OAuthFactory.getStrategy(platform);
    const authUrl = strategy.getAuthUrl(state);

    res.redirect(authUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('OAuth initiation failed');
  }
};

// @desc    Handle OAuth callback
// @route   GET /api/oauth/callback/:platform
// @access  Public (called by external provider)
const oauthCallback = async (req, res, next) => {
  try {
    const { platform } = req.params;
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/accounts?error=missing_params`);
    }

    // Verify state
    const decodedState = jwt.verify(state, process.env.JWT_SECRET || 'fallback_secret_for_dev');
    const { userId } = decodedState;

    if (decodedState.platform !== platform) {
      throw new Error('Platform mismatch in state');
    }

    const strategy = OAuthFactory.getStrategy(platform);
    const tokens = await strategy.handleCallback(code);

    // Save or update SocialAccount
    const filter = { userId, platform, externalAccountId: tokens.externalAccountId };
    const update = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenExpiresAt: tokens.tokenExpiresAt,
      profileName: tokens.profileName,
      status: 'CONNECTED',
    };

    await SocialAccount.findOneAndUpdate(filter, update, { upsert: true, new: true });

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/accounts?success=true`);
  } catch (error) {
    console.error('OAuth Callback Error:', JSON.stringify(error.response?.data || error.message, null, 2));
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/accounts?error=auth_failed`);
  }
};

// @desc    Get connected accounts for user
// @route   GET /api/oauth/accounts
// @access  Private
const getConnectedAccounts = async (req, res, next) => {
  try {
    const accounts = await SocialAccount.find({ userId: req.user.id }).select('-accessToken -refreshToken');
    res.json(accounts);
  } catch (error) {
    next(error);
  }
};

// @desc    Disconnect an account
// @route   DELETE /api/oauth/disconnect/:platform
// @access  Private
const disconnectPlatform = async (req, res, next) => {
  try {
    const { platform } = req.params;
    
    await SocialAccount.findOneAndDelete({ 
      userId: req.user.id, 
      platform: platform.toLowerCase() 
    });
    
    res.json({ success: true, message: `Disconnected ${platform}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  connectPlatform,
  oauthCallback,
  getConnectedAccounts,
  disconnectPlatform,
};
