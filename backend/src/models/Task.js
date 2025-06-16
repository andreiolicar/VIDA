module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'media',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'a_fazer',
    },
    recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.TaskList, { foreignKey: 'listId', as: 'list' });
    Task.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Task.hasMany(models.TaskAttachment, { foreignKey: 'taskId', as: 'attachments' });
    Task.hasMany(models.TaskReminder, { foreignKey: 'taskId', as: 'reminders' });
    Task.hasMany(models.Subtask, { foreignKey: 'taskId', as: 'subtasks', onDelete: 'CASCADE' });
  };

  return Task;
};
