module.exports = (sequelize, DataTypes) => {
  const VidaScore = sequelize.define('VidaScore', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    lastCalculatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  VidaScore.associate = (models) => {
    VidaScore.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return VidaScore;
};
