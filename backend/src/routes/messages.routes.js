const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', messagesController.sendMessage.bind(messagesController));
router.get('/conversation/:userId', messagesController.getConversation.bind(messagesController));
router.put('/:messageId/read', messagesController.markAsRead.bind(messagesController));
router.get('/unread/count', messagesController.getUnreadCount.bind(messagesController));

module.exports = router;