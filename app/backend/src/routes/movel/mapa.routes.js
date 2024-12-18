const express = require('express');
const controller = require('../../controllers/movel/mapa');

const router = express.Router();

router.get('/mapa-movel',
    controller.get);

module.exports = router;
