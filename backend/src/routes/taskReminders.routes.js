const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const remindersController = require("../controllers/taskReminders.controller");

/**
 * @swagger
 * tags:
 *   name: Lembretes de Tarefas
 *   description: Gerenciamento de lembretes das tarefas
 */

/**
 * @swagger
 * /reminders:
 *   post:
 *     summary: Adiciona um lembrete a uma tarefa
 *     tags: [Lembretes de Tarefas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-10T08:00:00Z
 *     responses:
 *       201:
 *         description: Lembrete adicionado com sucesso
 */
router.post("/", auth, remindersController.addReminder);

/**
 * @swagger
 * /reminders/task/{taskId}:
 *   get:
 *     summary: Lista lembretes de uma tarefa
 *     tags: [Lembretes de Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Lembretes retornados com sucesso
 */
router.get("/task/:taskId", auth, remindersController.getRemindersByTask);

/**
 * @swagger
 * /reminders/{id}:
 *   delete:
 *     summary: Remove um lembrete
 *     tags: [Lembretes de Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do lembrete
 *     responses:
 *       200:
 *         description: Lembrete removido com sucesso
 */
router.delete("/:id", auth, remindersController.deleteReminder);

module.exports = router;
