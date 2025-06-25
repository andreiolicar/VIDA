module.exports = (sequelize, DataTypes) => {
  const Health = sequelize.define('Health', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    roadmap: DataTypes.TEXT, // plano detalhado de autocuidado gerado por IA
    moodEntries: {
      type: DataTypes.JSON, // array de check-ins emocionais {date, mood, notes}
      allowNull: false,
      defaultValue: [],
    },
    habits: {
      type: DataTypes.JSON, // array de hábitos de bem-estar
      allowNull: false,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Health.associate = (models) => {
    Health.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Health;
};
