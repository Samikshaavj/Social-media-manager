const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Pinterest'],
    required: true,
  },
  externalAccountId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String, // Will be encrypted in production
    required: true,
  },
  refreshToken: {
    type: String, // Will be encrypted in production
  },
  tokenExpiresAt: {
    type: Date,
  },
  profileName: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  status: {
    type: String,
    enum: ['CONNECTED', 'ERROR', 'REAUTH_REQUIRED'],
    default: 'CONNECTED',
  }
}, { timestamps: true });

// Prevent duplicate connections for the same external account per user
socialAccountSchema.index({ userId: 1, platform: 1, externalAccountId: 1 }, { unique: true });

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
