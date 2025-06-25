'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    static associate(models) {
      FriendRequest.belongsTo(models.User, { as: 'requester', foreignKey: 'requesterUserId' });
      FriendRequest.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverUserId' });
    }
  }
  FriendRequest.init(
    {
      requesterUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'FriendRequest',
      tableName: 'FriendRequests',
    }
  );
  return FriendRequest;
};