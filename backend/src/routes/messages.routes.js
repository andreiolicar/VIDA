/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Gerenciamento de mensagens e conversas
 */

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Enviar uma mensagem para um usuário ou grupo
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID do destinatário (usuário ou grupo)
 *               text:
 *                 type: string
 *                 description: Conteúdo da mensagem
 *             required:
 *               - recipientId
 *               - text
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
router.post('/', messagesController.sendMessage.bind(messagesController));

/**
 * @swagger
 * /messages/conversation/{userId}:
 *   get:
 *     summary: Obter conversa com usuário específico
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário para buscar a conversa
 *     responses:
 *       200:
 *         description: Conversa obtida com sucesso
 */
router.get('/conversation/:userId', messagesController.getConversation.bind(messagesController));

/**
 * @swagger
 * /messages/{messageId}/read:
 *   put:
 *     summary: Marcar uma mensagem como lida
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da mensagem a ser marcada como lida
 *     responses:
 *       200:
 *         description: Mensagem marcada como lida
 */
router.put('/:messageId/read', messagesController.markAsRead.bind(messagesController));

/**
 * @swagger
 * /messages/unread/count:
 *   get:
 *     summary: Obter a contagem de mensagens não lidas
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem de mensagens não lidas retornada com sucesso
 */
router.get('/unread/count', messagesController.getUnreadCount.bind(messagesController));

module.exports = router;
