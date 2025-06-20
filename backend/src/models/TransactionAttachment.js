module.exports = (sequelize, DataTypes) => {
  const TransactionAttachment = sequelize.define('TransactionAttachment', {
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Transactions', key: 'id' },
      onDelete: 'CASCADE',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  TransactionAttachment.associate = (models) => {
    TransactionAttachment.belongsTo(models.Transaction, { foreignKey: 'transactionId', as: 'transaction' });
  };

  return TransactionAttachment;
};
