const express = require('express');
const router = express.Router();
const { generateCaption } = require('../controllers/aiController');
const auth = require('../middleware/auth'); // assuming we want it protected

router.post('/generate-caption', auth, generateCaption);

module.exports = router;
