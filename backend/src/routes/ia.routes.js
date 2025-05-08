const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../controllers/iaController');

router.post('/chat', chatWithGemini);

module.exports = router;
