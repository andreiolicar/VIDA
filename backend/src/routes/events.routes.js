/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gerenciamento de eventos do usuário
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const EventController = require("../controllers/EventController");

/**
 * @swagger
 * /events/{userId}:
 *   post:
 *     summary: Cria um novo evento para o usuário
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
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
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: Reunião com equipe
 *               description:
 *                 type: string
 *                 example: Alinhar o planejamento semanal
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-10
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/:userId", auth, EventController.createEvent);

/**
 * @swagger
 * /events/{userId}:
 *   get:
 *     summary: Retorna todos os eventos do usuário
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get("/:userId", auth, EventController.getAllEvents);

/**
 * @swagger
 * /events/{userId}/{id}:
 *   get:
 *     summary: Retorna um evento específico do usuário
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento retornado com sucesso
 *       404:
 *         description: Evento não encontrado
 */
router.get("/:userId/:id", auth, EventController.getEventById);

/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     summary: Atualiza um evento existente
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Reunião alterada
 *               description:
 *                 type: string
 *                 example: Mudança de horário
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-12
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.patch("/:id", auth, EventController.updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deleta um evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso
 *       404:
 *         description: Evento não encontrado
 */
router.delete("/:id", auth, EventController.deleteEvent);

module.exports = router;
