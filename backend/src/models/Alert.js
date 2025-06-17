module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define('Alert', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: { // 'expense_limit', 'payment_due', 'investment_opportunity', etc.
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Alert.associate = (models) => {
    Alert.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Alert;
};
