const { HealthAlert } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const { title, summary, details, date, priority, type, userAction } = req.body;
      const userId = req.params.userId;

      if (!['baixa', 'media', 'alta'].includes(priority)) {
        return res.status(400).json({ error: 'Prioridade inválida' });
      }

      const alert = await HealthAlert.create({
        title,
        summary,
        details,
        date,
        priority,
        type,
        userAction,
        userId,
      });

      res.status(201).json(alert);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar alerta' });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.params.userId;
      const alerts = await HealthAlert.findAll({
        where: { userId },
        order: [['date', 'DESC']],
      });
      res.json(alerts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar alertas' });
    }
  },
};
