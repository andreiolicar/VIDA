/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gerenciamento de consultas e exames
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const controller = require('../controllers/appointment.controller');

router.use(authMiddleware);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Lista todas as consultas e exames do usuário
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria uma nova consulta ou exame
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 example: Consulta médica
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-03T10:00:00.000Z
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso
 */
router.post('/', controller.create);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza uma consulta ou exame existente
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da consulta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Consulta atualizada com sucesso
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove uma consulta ou exame
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Consulta removida com sucesso
 */
router.delete('/:id', controller.remove);

module.exports = router;
