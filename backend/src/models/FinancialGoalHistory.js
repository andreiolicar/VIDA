module.exports = (sequelize, DataTypes) => {
  const FinancialGoalHistory = sequelize.define('FinancialGoalHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    goalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FinancialGoals', // nome da tabela no banco
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cumulativeAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'financial_goal_histories',
    timestamps: false,
  });

  FinancialGoalHistory.associate = (models) => {
    FinancialGoalHistory.belongsTo(models.FinancialGoal, { foreignKey: 'goalId', as: 'goal' });
  };

  return FinancialGoalHistory;
};
