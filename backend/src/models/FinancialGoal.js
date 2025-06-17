module.exports = (sequelize, DataTypes) => {
  const FinancialGoal = sequelize.define('FinancialGoal', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: { // 'active', 'completed', 'cancelled'
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  });

  FinancialGoal.associate = (models) => {
    FinancialGoal.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return FinancialGoal;
};
