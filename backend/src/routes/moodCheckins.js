const express = require('express');
const router = express.Router();
const moodCheckinController = require('../controllers/moodCheckin.controller');

router.post('/:userId', moodCheckinController.create);
router.get('/:userId', moodCheckinController.getAll);

module.exports = router;
