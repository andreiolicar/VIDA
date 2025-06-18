module.exports = (sequelize, DataTypes) => {
  const VidaScoreHistory = sequelize.define(
    "VidaScoreHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      recordedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "VidaScoreHistory",
      timestamps: true,
    }
  );

  VidaScoreHistory.associate = (models) => {
    VidaScoreHistory.belongsTo(models.User, { foreignKey: "userId" });
  };

  return VidaScoreHistory;
};
