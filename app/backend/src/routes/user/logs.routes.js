const express = require('express');
const controller = require('../../controllers/user/logs');

const router = express.Router();

router.get('/logs',
    controller.get); 

module.exports = router;