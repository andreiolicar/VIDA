'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WellnessHabit extends Model {
    static associate(models) {
      WellnessHabit.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  WellnessHabit.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      frequency: DataTypes.STRING,
      target: DataTypes.STRING,
      currentValue: DataTypes.STRING,
      unit: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'WellnessHabit',
    }
  );
  return WellnessHabit;
};
