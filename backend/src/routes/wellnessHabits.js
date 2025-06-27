const express = require('express');
const router = express.Router();
const wellnessHabitController = require('../controllers/wellnessHabitController');

router.post('/:userId', wellnessHabitController.create);
router.get('/:userId', wellnessHabitController.getAll);
router.put('/:id', wellnessHabitController.update);

module.exports = router;
