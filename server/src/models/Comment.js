const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  publicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication',
    required: true,
  },
  externalCommentId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  repliedTo: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
