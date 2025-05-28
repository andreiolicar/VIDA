module.exports = (sequelize, DataTypes) => {
    const StudyRoute = sequelize.define('StudyRoute', {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      area: DataTypes.STRING, // uma das 10 áreas mais estudadas por pessoas que estudam sozinhas
      roadmap: DataTypes.TEXT, // roadmap gerado por ia
      userId: DataTypes.INTEGER,
      favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  
    StudyRoute.associate = (models) => {
      StudyRoute.hasMany(models.StudyTopic, { foreignKey: 'routeId', as: 'topics' });
      StudyRoute.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return StudyRoute;
  };
  