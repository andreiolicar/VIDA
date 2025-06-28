const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkGroupOwnerOrAdmin } = require('../middleware/groupAuth.middleware');

router.use(authMiddleware);

// Grupos
router.post('/', groupsController.createGroup);
router.get('/', groupsController.listUserGroups);
router.get('/:groupId', groupsController.getGroupDetails);
router.put('/:groupId', checkGroupOwnerOrAdmin, groupsController.updateGroup);
router.delete('/:groupId', checkGroupOwnerOrAdmin, groupsController.deleteGroup);

// Membros
router.post('/:groupId/members', checkGroupOwnerOrAdmin, groupsController.addMember);
router.delete('/:groupId/members/:userId', checkGroupOwnerOrAdmin, groupsController.removeMember);
router.get('/:groupId/members', groupsController.listMembers);
router.put('/:groupId/members/:userId/role', checkGroupOwnerOrAdmin, groupsController.changeMemberRole);

// Mensagens
router.post('/:groupId/messages', groupsController.sendMessage);
router.get('/:groupId/messages', groupsController.getMessages);
router.put('/:groupId/messages/:messageId/read', groupsController.markMessageRead);

module.exports = router;