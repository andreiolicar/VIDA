const express = require('express');
const router = express.Router();
const healthAlertController = require('../controllers/healthAlertController');

router.post('/:userId', healthAlertController.create);
router.get('/:userId', healthAlertController.getAll);

module.exports = router;
