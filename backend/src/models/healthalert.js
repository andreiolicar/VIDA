'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HealthAlert extends Model {
    static associate(models) {
      HealthAlert.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  HealthAlert.init(
    {
      title: DataTypes.STRING,
      summary: DataTypes.TEXT,
      details: DataTypes.TEXT,
      date: DataTypes.DATE,
      priority: DataTypes.ENUM('baixa', 'media', 'alta'),
      type: DataTypes.STRING,
      userAction: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'HealthAlert',
    }
  );
  return HealthAlert;
};
