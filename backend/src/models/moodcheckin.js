'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoodCheckin extends Model {
    static associate(models) {
      MoodCheckin.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  MoodCheckin.init(
    {
      mood: {
        type: DataTypes.ENUM('feliz', 'ok', 'triste', 'irritado'),
        allowNull: false,
      },
      notes: DataTypes.TEXT,
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'MoodCheckin',
    }
  );
  return MoodCheckin;
};
