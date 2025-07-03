/**
 * @swagger
 * tags:
 *   name: WellnessHabits
 *   description: Gerenciamento de hábitos de bem-estar
 */

const express = require('express');
const router = express.Router();
const wellnessHabitController = require('../controllers/wellnessHabit.controller');

/**
 * @swagger
 * /wellness-habits/{userId}:
 *   post:
 *     summary: Cria um novo hábito de bem-estar para um usuário
 *     tags: [WellnessHabits]
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
 *               - name
 *               - target
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *                 example: Caminhada diária
 *               target:
 *                 type: number
 *                 example: 10000
 *               unit:
 *                 type: string
 *                 example: passos
 *               description:
 *                 type: string
 *                 example: Caminhar 10.000 passos por dia
 *     responses:
 *       201:
 *         description: Hábito criado com sucesso
 */
router.post('/:userId', wellnessHabitController.create);

/**
 * @swagger
 * /wellness-habits/{userId}:
 *   get:
 *     summary: Retorna todos os hábitos de bem-estar de um usuário
 *     tags: [WellnessHabits]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de hábitos retornada com sucesso
 */
router.get('/:userId', wellnessHabitController.getAll);

/**
 * @swagger
 * /wellness-habits/{id}:
 *   put:
 *     summary: Atualiza um hábito de bem-estar pelo ID
 *     tags: [WellnessHabits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do hábito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentValue:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Hábito atualizado com sucesso
 */
router.put('/:id', wellnessHabitController.update);

module.exports = router;
