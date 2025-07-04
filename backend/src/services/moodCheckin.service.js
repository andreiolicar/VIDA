const { MoodCheckin } = require('../models');

exports.createCheckin = async ({ mood, notes, date, userId }) => {
  if (!mood || !date || !userId) {
    const error = new Error('Campos obrigatórios ausentes');
    error.statusCode = 400;
    throw error;
  }

  const newCheckin = await MoodCheckin.create({
    mood,
    notes,
    date,
    userId,
  });

  return newCheckin;
};

exports.getAllCheckins = async (userId) => {
  if (!userId) {
    const error = new Error('UserId obrigatório');
    error.statusCode = 400;
    throw error;
  }

  return MoodCheckin.findAll({
    where: { userId },
    order: [['date', 'DESC']],
  });
};
