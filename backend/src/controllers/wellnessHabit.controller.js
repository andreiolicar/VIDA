const wellnessHabitService = require('../services/wellnessHabit.service');

const create = async (req, res) => {
  try {
    const userId = req.params.userId;
    const habit = await wellnessHabitService.createService(userId, req.body);
    res.status(201).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar hábito' });
  }
};

const getAll = async (req, res) => {
  try {
    const userId = req.params.userId;
    const habits = await wellnessHabitService.getAllService(userId);
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar hábitos' });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const habit = await wellnessHabitService.updateService(id, req.body);
    if (!habit) return res.status(404).json({ error: 'Hábito não encontrado' });
    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar hábito' });
  }
};

module.exports = { create, getAll, update };
