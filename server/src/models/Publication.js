const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  socialAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SocialAccount',
    required: true,
  },
  platform: {
    type: String,
    enum: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Pinterest'],
    required: true,
  },
  customContent: {
    type: String, // Overrides Post globalContent if set
  },
  customMedia: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaAsset'
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'SCHEDULED', 'QUEUED', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELLED'],
    default: 'DRAFT',
  },
  externalPostId: {
    type: String, // ID returned from the platform API after successful publish
  },
  errorDetails: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);
