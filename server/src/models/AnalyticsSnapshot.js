const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  socialAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SocialAccount',
  },
  platform: {
    type: String,
    enum: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Pinterest'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  metrics: {
    followers: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  }
}, { timestamps: true });

// Ensure unique snapshot per user, platform, and normalized date
analyticsSnapshotSchema.index({ userId: 1, platform: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
