module.exports = (sequelize, DataTypes) => {
    const TaskList = sequelize.define('TaskList', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING, // ex: 'mercado', 'projeto', 'doméstica'
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  
    TaskList.associate = (models) => {
      TaskList.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      TaskList.hasMany(models.Task, { foreignKey: 'listId', as: 'tasks' });
      TaskList.hasMany(models.TaskCollaborator, { foreignKey: 'listId', as: 'collaborators' });
    };
  
    return TaskList;
  };
  