module.exports = (sequelize, DataTypes) => {
  const TransactionHistory = sequelize.define('TransactionHistory', {
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Transactions', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    fieldName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oldValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  TransactionHistory.associate = (models) => {
    TransactionHistory.belongsTo(models.Transaction, { foreignKey: 'transactionId', as: 'transaction' });
    TransactionHistory.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return TransactionHistory;
};
