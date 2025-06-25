'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    static associate(models) {
      Friend.belongsTo(models.User, { as: 'user1', foreignKey: 'userId1' });
      Friend.belongsTo(models.User, { as: 'user2', foreignKey: 'userId2' });
    }
  }
  Friend.init(
    {
      userId1: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Friend',
      tableName: 'Friends',
    }
  );
  return Friend;
};
