/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Gerenciamento de registros de saúde
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/health.controller");

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Listar todos os registros de saúde
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Lista de registros de saúde retornada com sucesso
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /health:
 *   post:
 *     summary: Criar um novo registro de saúde
 *     tags: [Health]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registro de saúde criado com sucesso
 */
router.post("/", controller.create);

/**
 * @swagger
 * /health/{id}:
 *   put:
 *     summary: Atualizar um registro de saúde
 *     tags: [Health]
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
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registro de saúde atualizado com sucesso
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /health/{id}:
 *   delete:
 *     summary: Deletar um registro de saúde
 *     tags: [Health]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de saúde
 *     responses:
 *       200:
 *         description: Registro de saúde deletado com sucesso
 */
router.delete("/:id", controller.delete);

module.exports = router;
