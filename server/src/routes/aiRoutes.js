const express = require('express');
const router = express.Router();
const { generateCaption } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/generate-caption', protect, generateCaption);

module.exports = router;
