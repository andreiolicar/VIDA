/**
 * @swagger
 * tags:
 *   name: ChatSession
 *   description: Rotas de sessões de chat e integração com IA
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const express = require('express');
const router = express.Router();

const chatSessionController = require('../controllers/chatSession.controller');
const { summarizeWithGemini } = require('../controllers/ia.controller');
const verifyToken = require('../middleware/auth.middleware');

router.use(verifyToken);

/**
 * @swagger
 * /api/chat-session:
 *   get:
 *     summary: Lista todas as sessões de chat do usuário autenticado
 *     tags: [ChatSession]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de chats retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get('/', chatSessionController.listChats);

/**
 * @swagger
 * /api/chat-session:
 *   post:
 *     summary: Cria uma nova sessão de chat
 *     tags: [ChatSession]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Sessão de estudo de matemática
 *     responses:
 *       201:
 *         description: Chat criado com sucesso
 *       400:
 *         description: Erro ao criar chat
 */
router.post('/', chatSessionController.createChat);

/**
 * @swagger
 * /api/chat-session/ia/summarize:
 *   post:
 *     summary: Gera um resumo da conversa utilizando IA (Gemini)
 *     tags: [ChatSession]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 example: "abc123"
 *     responses:
 *       200:
 *         description: Resumo gerado com sucesso
 *       400:
 *         description: Erro ao gerar resumo
 */
router.post('/ia/summarize', summarizeWithGemini);

/**
 * @swagger
 * /api/chat-session/{id}:
 *   get:
 *     summary: Obtém uma sessão de chat pelo ID
 *     tags: [ChatSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sessão de chat
 *     responses:
 *       200:
 *         description: Chat encontrado
 *       404:
 *         description: Chat não encontrado
 */
router.get('/:id', chatSessionController.getChat);

/**
 * @swagger
 * /api/chat-session/{id}:
 *   patch:
 *     summary: Atualiza uma sessão de chat
 *     tags: [ChatSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sessão de chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Sessão de química atualizada
 *     responses:
 *       200:
 *         description: Chat atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar
 *       404:
 *         description: Chat não encontrado
 */
router.patch('/:id', chatSessionController.updateChat);

/**
 * @swagger
 * /api/chat-session/{id}:
 *   delete:
 *     summary: Exclui uma sessão de chat
 *     tags: [ChatSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sessão de chat
 *     responses:
 *       200:
 *         description: Chat excluído com sucesso
 *       404:
 *         description: Chat não encontrado
 */
router.delete('/:id', chatSessionController.deleteChat);

module.exports = router;
