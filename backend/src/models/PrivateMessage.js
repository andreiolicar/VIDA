module.exports = (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define(
    'PrivateMessage',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      senderUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'PrivateMessages',
      timestamps: false,
    }
  );

  PrivateMessage.associate = (models) => {
    PrivateMessage.belongsTo(models.User, { foreignKey: 'senderUserId', as: 'sender' });
    PrivateMessage.belongsTo(models.User, { foreignKey: 'receiverUserId', as: 'receiver' });
  };

  return PrivateMessage;
};