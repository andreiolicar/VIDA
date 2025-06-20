module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: { // 'income' ou 'expense'
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Transaction.hasMany(models.TransactionAttachment, { foreignKey: 'transactionId', as: 'attachments' });
    Transaction.hasMany(models.TransactionHistory, { foreignKey: 'transactionId', as: 'history' });
  };

  return Transaction;
};
