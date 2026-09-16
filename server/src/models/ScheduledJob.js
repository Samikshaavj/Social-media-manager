const mongoose = require('mongoose');

const scheduledJobSchema = new mongoose.Schema({
  publicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication',
    required: true,
  },
  executeAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  retryCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('ScheduledJob', scheduledJobSchema);
