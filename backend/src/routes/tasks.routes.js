const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const tasksController = require("../controllers/tasks.controller");

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: Gerenciamento de tarefas dentro das listas
 */

/**
 * @swagger
 * /tasks/{userId}:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               listId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 */
router.post("/:userId", auth, tasksController.createTask);

/**
 * @swagger
 * /tasks/list/{listId}:
 *   get:
 *     summary: Lista tarefas de uma lista
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefas da lista retornadas com sucesso
 */
router.get("/list/:listId", auth, tasksController.getTasksByList);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Retorna uma tarefa pelo ID
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 */
router.get("/:id", auth, tasksController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Atualiza uma tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 */
router.patch("/:id", auth, tasksController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Deleta uma tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 */
router.delete("/:id", auth, tasksController.deleteTask);

/**
 * @swagger
 * /tasks/kanban/{listId}:
 *   get:
 *     summary: Lista tarefas em formato Kanban
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefas no formato Kanban retornadas com sucesso
 */
router.get("/kanban/:listId", auth, tasksController.getTasksKanbanByList);

/**
 * @swagger
 * /tasks/calendar/{userId}:
 *   get:
 *     summary: Lista tarefas em formato de calendário
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefas no formato calendário retornadas com sucesso
 */
router.get("/calendar/:userId", auth, tasksController.getTasksCalendarByUser);

/**
 * @swagger
 * /tasks/user/{userId}:
 *   get:
 *     summary: Lista todas as tarefas do usuário
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefas do usuário retornadas com sucesso
 */
router.get('/user/:userId', auth, tasksController.getTasksByUser);

module.exports = router;
