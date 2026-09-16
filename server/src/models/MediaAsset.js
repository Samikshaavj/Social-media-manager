const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number, // in bytes
  },
  dimensions: {
    width: Number,
    height: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('MediaAsset', mediaAssetSchema);
