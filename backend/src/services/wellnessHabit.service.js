const { WellnessHabit } = require('../models');

const createService = async (userId, data) => {
  const { name, description, frequency, target, currentValue, unit } = data;

  return await WellnessHabit.create({
    name,
    description,
    frequency,
    target,
    currentValue,
    unit,
    userId,
  });
};

const getAllService = async (userId) => {
  return await WellnessHabit.findAll({
    where: { userId },
    order: [['createdAt', 'ASC']],
  });
};

const updateService = async (id, data) => {
  const habit = await WellnessHabit.findByPk(id);
  if (!habit) return null;

  await habit.update(data);
  return habit;
};

module.exports = {
  createService,
  getAllService,
  updateService,
};
