const express = require('express');
const controller = require('../../controllers/user/configuracoes');

const router = express.Router();

router.get('/configuracoes',
    controller.get);

router.put('/configuracoes',
    controller.put);    
// router.post('/inicio',
//     controller.post);

module.exports = router;