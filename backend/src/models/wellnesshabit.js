'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WellnessHabit extends Model {
    static associate(models) {
      WellnessHabit.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  WellnessHabit.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      frequency: DataTypes.STRING,
      target: DataTypes.STRING,
      currentValue: DataTypes.STRING,
      unit: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'WellnessHabit',
    }
  );
  return WellnessHabit;
};
