/**
 * @swagger
 * tags:
 *   name: WellnessHabits
 *   description: Gerenciamento de hábitos de bem-estar dos usuários
 */

const express = require('express');
const router = express.Router();
const wellnessHabitController = require('../controllers/wellnessHabit.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

/**
 * @swagger
 * /wellnesshabits/{userId}:
 *   post:
 *     summary: Criar um novo hábito de bem-estar para um usuário
 *     tags: [WellnessHabits]
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
 *             properties:
 *               habit:
 *                 type: string
 *                 example: "Meditar diariamente"
 *               frequency:
 *                 type: string
 *                 example: "Diário"
 *               notes:
 *                 type: string
 *                 example: "Pelo menos 10 minutos por dia"
 *     responses:
 *       201:
 *         description: Hábito criado com sucesso
 */
router.post('/:userId', wellnessHabitController.create);

/**
 * @swagger
 * /wellnesshabits/{userId}:
 *   get:
 *     summary: Listar hábitos de bem-estar de um usuário
 *     tags: [WellnessHabits]
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
 *         description: Lista de hábitos retornada com sucesso
 */
router.get('/:userId', wellnessHabitController.getAll);

/**
 * @swagger
 * /wellnesshabits/{id}:
 *   put:
 *     summary: Atualizar um hábito de bem-estar pelo ID
 *     tags: [WellnessHabits]
 *     security:
 *       - bearerAuth: []
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
 *               habit:
 *                 type: string
 *                 example: "Meditar diariamente"
 *               frequency:
 *                 type: string
 *                 example: "Semanal"
 *               notes:
 *                 type: string
 *                 example: "Pelo menos 3 vezes por semana"
 *     responses:
 *       200:
 *         description: Hábito atualizado com sucesso
 */
router.put('/:id', wellnessHabitController.update);

/**
 * @swagger
 * /wellnesshabits/{id}:
 *   delete:
 *     summary: Remover um hábito de bem-estar pelo ID
 *     tags: [WellnessHabits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do hábito
 *     responses:
 *       200:
 *         description: Hábito removido com sucesso
 */
router.delete('/:id', wellnessHabitController.remove);

module.exports = router;
