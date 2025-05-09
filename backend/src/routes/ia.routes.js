const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../controllers/iaController');

/**
 * @swagger
 * tags:
 *   name: IA
 *   description: Interações com inteligência artificial
 */

/**
 * @swagger
 * /ia/chat:
 *   post:
 *     summary: Envia uma mensagem para a IA (Gemini)
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Qual a capital da França?
 *     responses:
 *       200:
 *         description: Resposta da IA
 *       500:
 *         description: Erro interno
 */
router.post('/chat', chatWithGemini);

module.exports = router;
