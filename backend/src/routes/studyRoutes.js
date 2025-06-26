/**
 * @swagger
 * tags:
 *   name: StudyRoutes
 *   description: Gerenciamento de rotas de estudo
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
const StudyRouteController = require("../controllers/studyRoute.controller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * /studyroutes/{userId}:
 *   post:
 *     summary: Cria uma nova rota de estudo para um usuário
 *     tags: [StudyRoutes]
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
 *               - topics
 *             properties:
 *               title:
 *                 type: string
 *                 example: Rota de estudos para backend
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Node.js", "Express", "MongoDB"]
 *     responses:
 *       201:
 *         description: Rota criada com sucesso
 */
router.post("/:userId", auth, StudyRouteController.createRoute);

/**
 * @swagger
 * /studyroutes/{userId}:
 *   get:
 *     summary: Retorna todas as rotas de estudo do usuário
 *     tags: [StudyRoutes]
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
 *         description: Lista de rotas retornada com sucesso
 */
router.get("/:userId", auth, StudyRouteController.getAllRoutes);

/**
 * @swagger
 * /studyroutes/getone/{id}:
 *   get:
 *     summary: Retorna uma rota de estudo pelo ID
 *     tags: [StudyRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da rota de estudo
 *     responses:
 *       200:
 *         description: Rota encontrada
 *       404:
 *         description: Rota não encontrada
 */
router.get("/getone/:id", auth, StudyRouteController.getRouteById);

/**
 * @swagger
 * /studyroutes/topics/{id}:
 *   patch:
 *     summary: Atualiza a conclusão de um tópico em uma rota
 *     tags: [StudyRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da rota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - completed
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Node.js
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Tópico atualizado com sucesso
 */
router.patch("/topics/:id", auth, StudyRouteController.updateTopicCompletion);

/**
 * @swagger
 * /studyroutes/{id}:
 *   patch:
 *     summary: Atualiza dados da rota de estudo
 *     tags: [StudyRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da rota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nova rota de backend
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["GraphQL", "Prisma"]
 *     responses:
 *       200:
 *         description: Rota atualizada com sucesso
 */
router.patch("/:id", auth, StudyRouteController.updateRoute);

/**
 * @swagger
 * /studyroutes/{id}:
 *   delete:
 *     summary: Deleta uma rota de estudo
 *     tags: [StudyRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da rota
 *     responses:
 *       200:
 *         description: Rota deletada com sucesso
 */
router.delete("/:id", auth, StudyRouteController.deleteRoute);

module.exports = router;
