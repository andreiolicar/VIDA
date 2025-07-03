'use strict';
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('consulta', 'exame'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    priority: {
      type: DataTypes.ENUM('baixa', 'media', 'alta'),
      allowNull: false,
      defaultValue: 'media',
    },
  }, {});

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Appointment;
};
