const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  globalContent: {
    type: String,
    required: true,
  },
  globalMedia: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaAsset'
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED'],
    default: 'DRAFT',
  },
  scheduledFor: {
    type: Date, // UTC
  },
  timezone: {
    type: String,
    default: 'UTC'
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
