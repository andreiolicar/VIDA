/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Gerenciamento da área de saúde mental e física
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
const HealthController = require("../controllers/healthcontroller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * /health/{userId}:
 *   post:
 *     summary: Cria um novo registro de saúde para um usuário
 *     tags: [Health]
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
 *               - description
 *               - roadmap
 *               - moodEntries
 *               - habits
 *             properties:
 *               title:
 *                 type: string
 *                 example: Plano de autocuidado mental
 *               description:
 *                 type: string
 *                 example: Plano detalhado para melhora da saúde mental
 *               roadmap:
 *                 type: string
 *                 example: "Passo 1: Meditação diária, Passo 2: Exercícios físicos..."
 *               moodEntries:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2025-06-25
 *                     mood:
 *                       type: string
 *                       example: "Ansioso"
 *                     notes:
 *                       type: string
 *                       example: "Me senti mais calmo após a meditação."
 *               habits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Meditação", "Exercícios físicos", "Boa alimentação"]
 *     responses:
 *       201:
 *         description: Registro de saúde criado com sucesso
 */
router.post("/:userId", auth, healthcontroller.createHealthRecord);

/**
 * @swagger
 * /health/{userId}:
 *   get:
 *     summary: Retorna todos os registros de saúde do usuário
 *     tags: [Health]
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
 *         description: Lista de registros retornada com sucesso
 */
router.get("/:userId", auth, healthcontroller.getAllHealthRecords);

/**
 * @swagger
 * /health/getone/{id}:
 *   get:
 *     summary: Retorna um registro de saúde pelo ID
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de saúde
 *     responses:
 *       200:
 *         description: Registro encontrado
 *       404:
 *         description: Registro não encontrado
 */
router.get("/getone/:id", auth, healthcontroller.getHealthRecordById);

/**
 * @swagger
 * /health/{id}:
 *   patch:
 *     summary: Atualiza um registro de saúde pelo ID
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de saúde
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
 *               roadmap:
 *                 type: string
 *               moodEntries:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     mood:
 *                       type: string
 *                     notes:
 *                       type: string
 *               habits:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Registro atualizado com sucesso
 *       404:
 *         description: Registro não encontrado
 */
router.patch("/:id", auth, healthcontroller.updateHealthRecord);

/**
 * @swagger
 * /health/{id}:
 *   delete:
 *     summary: Deleta um registro de saúde pelo ID
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de saúde
 *     responses:
 *       200:
 *         description: Registro deletado com sucesso
 */
router.delete("/:id", auth, healthcontroller.deleteHealthRecord);

module.exports = router;
