const express = require('express');
const router = express.Router();
const wellnessHabitController = require('../controllers/wellnessHabitController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/:userId', wellnessHabitController.create);
router.get('/:userId', wellnessHabitController.getAll);
router.put('/:id', wellnessHabitController.update);
router.delete('/:id', wellnessHabitController.remove);

module.exports = router;
