const express = require('express');
const router = express.Router();
const { Subtask } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Subtasks
 *   description: Management of subtasks related to tasks
 */

/**
 * @swagger
 * /subtasks:
 *   post:
 *     summary: Create a new subtask
 *     tags: [Subtasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - title
 *             properties:
 *               taskId:
 *                 type: integer
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subtask created successfully
 *       400:
 *         description: Missing taskId or title
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { taskId, title } = req.body;
    if (!taskId || !title) {
      return res.status(400).json({ message: 'taskId e title são obrigatórios' });
    }
    const subtask = await Subtask.create({ taskId, title });
    res.status(201).json(subtask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar subtarefa' });
  }
});

/**
 * @swagger
 * /subtasks/task/{taskId}:
 *   get:
 *     summary: Get all subtasks by task ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: List of subtasks
 *       500:
 *         description: Server error
 */
router.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtasks = await Subtask.findAll({ where: { taskId } });
    res.json(subtasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar subtarefas' });
  }
});

/**
 * @swagger
 * /subtasks/{id}:
 *   patch:
 *     summary: Update a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the subtask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subtask updated
 *       404:
 *         description: Subtask not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const subtask = await Subtask.findByPk(id);
    if (!subtask) return res.status(404).json({ message: 'Subtarefa não encontrada' });

    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) subtask.completed = completed;

    await subtask.save();
    res.json(subtask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar subtarefa' });
  }
});

/**
 * @swagger
 * /subtasks/{id}:
 *   delete:
 *     summary: Delete a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the subtask
 *     responses:
 *       204:
 *         description: Subtask deleted successfully
 *       404:
 *         description: Subtask not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Subtask.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Subtarefa não encontrada' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar subtarefa' });
  }
});

module.exports = router;
