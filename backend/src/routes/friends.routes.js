const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/search', friendsController.searchUsers);
router.post('/requests', friendsController.sendRequest);
router.put('/requests/:requestId/accept', friendsController.acceptRequest);
router.put('/requests/:requestId/reject', friendsController.rejectRequest);
router.get('/', friendsController.listFriends);
router.get('/requests', friendsController.listReceivedRequests);

module.exports = router;