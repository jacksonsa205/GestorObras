const express = require('express');
const controller = require('../../controllers/dashboard/painelEntrante');

const router = express.Router();

router.get('/painel-entrante',
    controller.get);

module.exports = router;
