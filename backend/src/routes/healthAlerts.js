/**
 * @swagger
 * tags:
 *   name: HealthAlerts
 *   description: Gerenciamento de alertas de saúde
 */

const express = require('express');
const router = express.Router();
const healthAlertController = require('../controllers/healthAlert.controller');

/**
 * @swagger
 * /health-alerts/{userId}:
 *   post:
 *     summary: Cria um novo alerta de saúde para um usuário
 *     tags: [HealthAlerts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 example: Alerta de pressão alta
 *               summary:
 *                 type: string
 *                 example: Pressão arterial acima do recomendado
 *               priority:
 *                 type: string
 *                 example: alta
 *               userAction:
 *                 type: string
 *                 example: /dashboard/health/score
 *     responses:
 *       201:
 *         description: Alerta criado com sucesso
 */
router.post('/:userId', healthAlertController.create);

/**
 * @swagger
 * /health-alerts/{userId}:
 *   get:
 *     summary: Retorna todos os alertas de saúde de um usuário
 *     tags: [HealthAlerts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de alertas retornada com sucesso
 */
router.get('/:userId', healthAlertController.getAll);

module.exports = router;
