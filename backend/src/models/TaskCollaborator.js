module.exports = (sequelize, DataTypes) => {
    const TaskCollaborator = sequelize.define('TaskCollaborator', {
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING, // ex: 'owner', 'editor', 'viewer'
        allowNull: false,
        defaultValue: 'editor',
      },
    });
  
    TaskCollaborator.associate = (models) => {
      TaskCollaborator.belongsTo(models.TaskList, { foreignKey: 'listId', as: 'list' });
      TaskCollaborator.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
  
    return TaskCollaborator;
  };
  