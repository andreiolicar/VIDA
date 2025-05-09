const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const collaboratorsController = require("../controllers/taskCollaborators.controller");

/**
 * @swagger
 * tags:
 *   name: Colaboradores de Listas
 *   description: Gerenciamento de colaboradores em listas de tarefas
 */

/**
 * @swagger
 * /collaborators:
 *   post:
 *     summary: Adiciona um colaborador a uma lista
 *     tags: [Colaboradores de Listas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listId:
 *                 type: integer
 *               collaboratorEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Colaborador adicionado com sucesso
 */
router.post("/", auth, collaboratorsController.addCollaborator);

/**
 * @swagger
 * /collaborators/list/{listId}:
 *   get:
 *     summary: Lista os colaboradores de uma lista
 *     tags: [Colaboradores de Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da lista
 *     responses:
 *       200:
 *         description: Colaboradores retornados com sucesso
 */
router.get("/list/:listId", auth, collaboratorsController.getCollaboratorsByList);

/**
 * @swagger
 * /collaborators/{id}:
 *   delete:
 *     summary: Remove um colaborador da lista
 *     tags: [Colaboradores de Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do colaborador
 *     responses:
 *       200:
 *         description: Colaborador removido com sucesso
 */
router.delete("/:id", auth, collaboratorsController.removeCollaborator);

module.exports = router;
