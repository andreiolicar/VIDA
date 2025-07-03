const { WellnessHabit } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const { name, description, frequency, target, currentValue, unit } = req.body;
      const userId = parseInt(req.params.userId, 10);

      if (!name?.trim()) {
        return res.status(400).json({ error: 'Nome do hábito é obrigatório.' });
      }

      const habit = await WellnessHabit.create({
        name,
        description,
        frequency,
        target,
        currentValue,
        unit,
        userId,
      });

      res.status(201).json(habit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar hábito.' });
    }
  },

  async getAll(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const habits = await WellnessHabit.findAll({
        where: { userId },
        order: [['createdAt', 'ASC']],
      });
      res.json(habits);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar hábitos.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const habit = await WellnessHabit.findByPk(id);

      if (!habit) {
        return res.status(404).json({ error: 'Hábito não encontrado.' });
      }

      await habit.update(req.body);
      res.json(habit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar hábito.' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const habit = await WellnessHabit.findByPk(id);

      if (!habit) {
        return res.status(404).json({ error: 'Hábito não encontrado.' });
      }

      await habit.destroy();
      res.json({ message: 'Hábito removido com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao remover hábito.' });
    }
  },
};
