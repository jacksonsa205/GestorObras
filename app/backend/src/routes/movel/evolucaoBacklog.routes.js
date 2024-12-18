const express = require('express');
const controller = require('../../controllers/movel/evolucaoBacklog');

const router = express.Router();

router.get('/evolucao-backlog',
    controller.get);

module.exports = router;
