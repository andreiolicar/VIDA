const moodCheckinService = require('../services/moodCheckin.service');

module.exports = {
  async create(req, res) {
    try {
      const { mood, notes, date } = req.body;
      const userId = parseInt(req.params.userId, 10);

      const checkin = await moodCheckinService.createCheckin({
        mood,
        notes,
        date,
        userId,
      });

      return res.status(201).json(checkin);
    } catch (error) {
      console.error('Erro ao criar check-in:', error);
      res
        .status(error.statusCode || 500)
        .json({ error: error.message || 'Erro interno no servidor' });
    }
  },

  async getAll(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const list = await moodCheckinService.getAllCheckins(userId);
      res.json(list);
    } catch (error) {
      console.error('Erro ao buscar check-ins:', error);
      res.status(error.statusCode || 500).json({
        error: error.message || 'Erro ao buscar check-ins',
      });
    }
  },
};
