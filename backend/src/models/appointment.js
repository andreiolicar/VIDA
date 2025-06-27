'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Appointment.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      datetime: DataTypes.DATE,
      type: DataTypes.ENUM('consulta', 'exame'),
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Appointment',
    }
  );
  return Appointment;
};
