/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gerenciamento de consultas e exames
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentcontroller');

/**
 * @swagger
 * /appointments/{userId}:
 *   post:
 *     summary: Cria um novo agendamento para um usuário
 *     tags: [Appointments]
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
 *               - dateTime
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Consulta com cardiologista
 *               dateTime:
 *                 type: string
 *                 example: 2025-06-27T15:00:00Z
 *               type:
 *                 type: string
 *                 example: consulta
 *               description:
 *                 type: string
 *                 example: Avaliação de rotina
 *               location:
 *                 type: string
 *                 example: Hospital São Lucas
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 */
router.post('/:userId', appointmentController.create);

/**
 * @swagger
 * /appointments/{userId}:
 *   get:
 *     summary: Retorna todos os agendamentos de um usuário
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 */
router.get('/:userId', appointmentController.getAll);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Deleta um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento deletado com sucesso
 */
router.delete('/:id', appointmentController.delete);

module.exports = router;
