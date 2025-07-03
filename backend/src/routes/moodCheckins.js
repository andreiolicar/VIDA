/**
 * @swagger
 * tags:
 *   name: MoodCheckins
 *   description: Registro e consulta de check-ins de humor dos usuários
 */

const express = require('express');
const router = express.Router();
const moodCheckinController = require('../controllers/moodCheckinController');

/**
 * @swagger
 * /moodcheckins/{userId}:
 *   post:
 *     summary: Registrar um novo check-in de humor para um usuário
 *     tags: [MoodCheckins]
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
 *             properties:
 *               mood:
 *                 type: string
 *                 example: "Feliz"
 *               notes:
 *                 type: string
 *                 example: "Hoje foi um ótimo dia!"
 *     responses:
 *       201:
 *         description: Check-in criado com sucesso
 */
router.post('/:userId', moodCheckinController.create);

/**
 * @swagger
 * /moodcheckins/{userId}:
 *   get:
 *     summary: Listar todos os check-ins de humor de um usuário
 *     tags: [MoodCheckins]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de check-ins retornada com sucesso
 */
router.get('/:userId', moodCheckinController.getAll);

module.exports = router;
