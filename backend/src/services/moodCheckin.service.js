const { MoodCheckin } = require('../models');

const validMoods = ['feliz', 'ok', 'triste', 'irritado'];

async function createCheckin({ mood, notes, date, userId }) {
  if (!validMoods.includes(mood)) {
    const error = new Error('Mood inválido');
    error.statusCode = 400;
    throw error;
  }

  const checkin = await MoodCheckin.create({ mood, notes, date, userId });
  return checkin;
}

async function getAllCheckins(userId) {
  return MoodCheckin.findAll({
    where: { userId },
    order: [['date', 'DESC']],
  });
}

module.exports = {
  createCheckin,
  getAllCheckins,
};
