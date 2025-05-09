const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const taskListsController = require("../controllers/taskLists.controller");

/**
 * @swagger
 * tags:
 *   name: Listas de Tarefas
 *   description: Gerenciamento de listas de tarefas do usuário
 */

/**
 * @swagger
 * /tasklists:
 *   post:
 *     summary: Cria uma nova lista de tarefas
 *     tags: [Listas de Tarefas]
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
 *                 example: Lista de Estudos
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 */
router.post('/', auth, taskListsController.createTaskList);

/**
 * @swagger
 * /tasklists/user/{userId}:
 *   get:
 *     summary: Retorna todas as listas de um usuário
 *     tags: [Listas de Tarefas]
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
 *         description: Listas retornadas com sucesso
 */
router.get("/user/:userId", auth, taskListsController.getAllTaskLists);

/**
 * @swagger
 * /tasklists/{id}:
 *   get:
 *     summary: Retorna uma lista pelo ID
 *     tags: [Listas de Tarefas]
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
 *         description: Lista encontrada
 */
router.get("/:id", auth, taskListsController.getTaskListById);

/**
 * @swagger
 * /tasklists/{id}:
 *   patch:
 *     summary: Atualiza uma lista de tarefas
 *     tags: [Listas de Tarefas]
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
 *     responses:
 *       200:
 *         description: Lista atualizada com sucesso
 */
router.patch("/:id", auth, taskListsController.updateTaskList);

/**
 * @swagger
 * /tasklists/{id}:
 *   delete:
 *     summary: Deleta uma lista
 *     tags: [Listas de Tarefas]
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
 *         description: Lista deletada com sucesso
 */
router.delete("/:id", auth, taskListsController.deleteTaskList);

module.exports = router;
