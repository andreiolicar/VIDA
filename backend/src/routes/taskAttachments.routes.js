const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const attachmentsController = require("../controllers/taskAttachments.controller");

/**
 * @swagger
 * tags:
 *   name: Anexos de Tarefas
 *   description: Gerenciamento de anexos das tarefas
 */

/**
 * @swagger
 * /attachments:
 *   post:
 *     summary: Adiciona um anexo a uma tarefa
 *     tags: [Anexos de Tarefas]
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
 *               fileUrl:
 *                 type: string
 *                 example: http://exemplo.com/arquivo.pdf
 *     responses:
 *       201:
 *         description: Anexo adicionado com sucesso
 */
router.post("/", auth, attachmentsController.addAttachment);

/**
 * @swagger
 * /attachments/task/{taskId}:
 *   get:
 *     summary: Lista anexos de uma tarefa
 *     tags: [Anexos de Tarefas]
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
 *         description: Lista de anexos retornada com sucesso
 */
router.get("/task/:taskId", auth, attachmentsController.getAttachmentsByTask);

/**
 * @swagger
 * /attachments/{id}:
 *   delete:
 *     summary: Remove um anexo
 *     tags: [Anexos de Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do anexo
 *     responses:
 *       200:
 *         description: Anexo removido com sucesso
 */
router.delete("/:id", auth, attachmentsController.deleteAttachment);

module.exports = router;
