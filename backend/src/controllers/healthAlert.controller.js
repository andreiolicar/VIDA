const healthAlertService = require('../services/healthAlert.service');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.params.userId;
      const alert = await healthAlertService.createHealthAlert({
        ...req.body,
        userId,
      });

      res.status(201).json(alert);
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Erro interno' });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.params.userId;
      const alerts = await healthAlertService.getAllHealthAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      res.status(500).json({ error: 'Erro ao buscar alertas' });
    }
  },
};
