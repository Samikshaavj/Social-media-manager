const express = require('express');
const router = express.Router();
const { connectPlatform, oauthCallback, getConnectedAccounts, disconnectPlatform } = require('../controllers/oauthController');
const { protect } = require('../middleware/auth');

router.get('/connect/:platform', connectPlatform);
router.get('/callback/:platform', oauthCallback);
router.get('/accounts', protect, getConnectedAccounts);
router.delete('/disconnect/:platform', protect, disconnectPlatform);

module.exports = router;
