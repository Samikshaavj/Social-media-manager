const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const MediaAsset = require('../models/MediaAsset');

// @desc    Upload media
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('media'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const ext = req.file.filename.toLowerCase();
    const isVideo = req.file.mimetype.startsWith('video/') || ext.endsWith('.mp4') || ext.endsWith('.mov');

    const mediaAsset = await MediaAsset.create({
      userId: req.user.id,
      url: `/uploads/${req.file.filename}`, // Local URL for now
      type: isVideo ? 'VIDEO' : 'IMAGE',
      sizeBytes: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json(mediaAsset);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
