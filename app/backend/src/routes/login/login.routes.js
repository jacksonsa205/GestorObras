const express = require('express');
const postController = require('../../controllers/login/login');

const router = express.Router();

router.post('/', postController.post);

module.exports = router;
