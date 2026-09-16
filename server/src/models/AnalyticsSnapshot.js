const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema({
  socialAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SocialAccount',
    required: true,
  },
  publicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication',
  },
  metrics: {
    type: Map,
    of: Number,
    // e.g. { likes: 10, shares: 2, views: 100 }
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
