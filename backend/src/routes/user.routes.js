/**
 * @swagger
 * tags:
 *   name: Usuário
 *   description: Rotas relacionadas ao perfil do usuário
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
const verifyToken = require("../middleware/auth.middleware");
const { User } = require("../models");
const { updateProfile, getProfile } = require("../controllers/user.controller");

/**
 * @swagger
 * /api/user/get/{userId}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/get/:userId", verifyToken, getProfile);

/**
 * @swagger
 * /api/user/update/{userId}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Usuário]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/update/:userId", verifyToken, updateProfile);

module.exports = router;

module.exports = router;
