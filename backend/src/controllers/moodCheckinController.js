const { MoodCheckin } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const { mood, notes, date } = req.body;
      const userId = req.params.userId;

      if (!['feliz', 'ok', 'triste', 'irritado'].includes(mood)) {
        return res.status(400).json({ error: 'Mood inválido' });
      }

      const checkin = await MoodCheckin.create({
        mood,
        notes,
        date,
        userId,
      });

      return res.status(201).json(checkin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar check-in' });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.params.userId;
      const list = await MoodCheckin.findAll({
        where: { userId },
        order: [['date', 'DESC']],
      });
      res.json(list);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar check-ins' });
    }
  },
};
