const express = require('express');
const router = express.Router();
const authenticator = require('../../controllers/authenticator/authenticator');

router.post('/generate-secret', authenticator.generateSecret);
router.post('/verify-token', authenticator.verifyToken);

module.exports = router;