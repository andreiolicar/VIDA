const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkGroupOwnerOrAdmin, checkGroupOwner } = require('../middleware/groupAuth.middleware');

router.use(authMiddleware);

// Grupos
router.post('/', groupsController.createGroup);
router.get('/', groupsController.listUserGroups);
router.get('/:groupId', groupsController.getGroupDetails);
router.put('/:groupId', checkGroupOwnerOrAdmin, groupsController.updateGroup); // Owner OU Admin
router.delete('/:groupId', checkGroupOwner, groupsController.deleteGroup); // APENAS OWNER

// Membros
router.post('/:groupId/members', checkGroupOwnerOrAdmin, groupsController.addMember); // Owner OU Admin
router.delete('/:groupId/members/:userId', checkGroupOwnerOrAdmin, groupsController.removeMember); // Owner OU Admin
router.get('/:groupId/members', groupsController.listMembers);
router.put('/:groupId/members/:userId/role', checkGroupOwnerOrAdmin, groupsController.changeMemberRole); // Owner OU Admin

// Mensagens
router.post('/:groupId/messages', groupsController.sendMessage);
router.get('/:groupId/messages', groupsController.getMessages);
router.put('/:groupId/messages/:messageId/read', groupsController.markMessageRead);

// Outros (busca de usuários)
router.get('/users', groupsController.search);

module.exports = router;