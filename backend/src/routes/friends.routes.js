/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Gerenciamento de amizades entre usuários
 */

const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

/**
 * @swagger
 * /friends/search:
 *   get:
 *     summary: Buscar usuários por nome ou e-mail
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get('/search', friendsController.searchUsers);

/**
 * @swagger
 * /friends/requests:
 *   post:
 *     summary: Enviar solicitação de amizade
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *             properties:
 *               receiverId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Solicitação enviada com sucesso
 */
router.post('/requests', friendsController.sendRequest);

/**
 * @swagger
 * /friends/requests/{requestId}/accept:
 *   put:
 *     summary: Aceitar solicitação de amizade
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: requestId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitação aceita
 */
router.put('/requests/:requestId/accept', friendsController.acceptRequest);

/**
 * @swagger
 * /friends/requests/{requestId}/reject:
 *   put:
 *     summary: Rejeitar solicitação de amizade
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: requestId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitação rejeitada
 */
router.put('/requests/:requestId/reject', friendsController.rejectRequest);

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Listar amigos do usuário
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de amigos retornada com sucesso
 */
router.get('/', friendsController.listFriends);

/**
 * @swagger
 * /friends/requests:
 *   get:
 *     summary: Listar solicitações de amizade recebidas
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitações retornada com sucesso
 */
router.get('/requests', friendsController.listReceivedRequests);

module.exports = router;
