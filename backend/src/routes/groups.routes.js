/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Gerenciamento de grupos, membros e mensagens
 */

const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkGroupOwnerOrAdmin, checkGroupOwner } = require('../middleware/groupAuth.middleware');

router.use(authMiddleware);

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Criar um novo grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 */
router.post('/', groupsController.createGroup);

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Listar todos os grupos do usuário
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos retornada com sucesso
 */
router.get('/', groupsController.listUserGroups);

/**
 * @swagger
 * /groups/{groupId}:
 *   get:
 *     summary: Obter detalhes de um grupo específico
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do grupo retornados com sucesso
 */
router.get('/:groupId', groupsController.getGroupDetails);

/**
 * @swagger
 * /groups/{groupId}:
 *   put:
 *     summary: Atualizar dados de um grupo (somente Owner ou Admin)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grupo atualizado com sucesso
 */
router.put('/:groupId', checkGroupOwnerOrAdmin, groupsController.updateGroup);

/**
 * @swagger
 * /groups/{groupId}:
 *   delete:
 *     summary: Excluir grupo (somente Owner)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grupo excluído com sucesso
 */
router.delete('/:groupId', checkGroupOwner, groupsController.deleteGroup);

/**
 * @swagger
 * /groups/{groupId}/members:
 *   post:
 *     summary: Adicionar membro ao grupo (Owner/Admin)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membro adicionado com sucesso
 */
router.post('/:groupId/members', checkGroupOwnerOrAdmin, groupsController.addMember);

/**
 * @swagger
 * /groups/{groupId}/members/{userId}:
 *   delete:
 *     summary: Remover membro do grupo (Owner/Admin)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membro removido com sucesso
 */
router.delete('/:groupId/members/:userId', checkGroupOwnerOrAdmin, groupsController.removeMember);

/**
 * @swagger
 * /groups/{groupId}/members:
 *   get:
 *     summary: Listar membros de um grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de membros retornada com sucesso
 */
router.get('/:groupId/members', groupsController.listMembers);

/**
 * @swagger
 * /groups/{groupId}/members/{userId}/role:
 *   put:
 *     summary: Alterar função de um membro (Owner/Admin)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Função atualizada com sucesso
 */
router.put('/:groupId/members/:userId/role', checkGroupOwnerOrAdmin, groupsController.changeMemberRole);

/**
 * @swagger
 * /groups/{groupId}/messages:
 *   post:
 *     summary: Enviar mensagem para o grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
router.post('/:groupId/messages', groupsController.sendMessage);

/**
 * @swagger
 * /groups/{groupId}/messages:
 *   get:
 *     summary: Obter mensagens de um grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensagens retornadas com sucesso
 */
router.get('/:groupId/messages', groupsController.getMessages);

/**
 * @swagger
 * /groups/{groupId}/messages/{messageId}/read:
 *   put:
 *     summary: Marcar mensagem como lida
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: messageId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensagem marcada como lida
 */
router.put('/:groupId/messages/:messageId/read', groupsController.markMessageRead);

/**
 * @swagger
 * /groups/search/users:
 *   get:
 *     summary: Buscar usuários para adicionar ao grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get('/search/users', groupsController.search);

module.exports = router;
