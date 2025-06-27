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
      mood: DataTypes.ENUM('feliz', 'ok', 'triste', 'irritado'),
      notes: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'MoodCheckin',
    }
  );
  return MoodCheckin;
};
