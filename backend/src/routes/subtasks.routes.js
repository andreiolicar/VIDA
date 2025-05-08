// subtasks.routes.js
const express = require('express');
const router = express.Router();
const { Subtask } = require('../models'); // ajuste conforme sua estrutura
const { Op } = require('sequelize');

// Criar nova subtarefa
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

// Listar subtarefas por taskId
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

// Atualizar subtarefa (ex: título, completed)
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

// Deletar subtarefa
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
