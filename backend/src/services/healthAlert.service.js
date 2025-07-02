const { HealthAlert } = require('../models');

const PRIORITIES = ['baixa', 'media', 'alta'];

module.exports = {
  async createHealthAlert({ title, summary, details, date, priority, type, userAction, userId }) {
    if (!PRIORITIES.includes(priority)) {
      const error = new Error('Prioridade inválida');
      error.statusCode = 400;
      throw error;
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

    return alert;
  },

  async getAllHealthAlerts(userId) {
    return await HealthAlert.findAll({
      where: { userId },
      order: [['date', 'DESC']],
    });
  },
};
