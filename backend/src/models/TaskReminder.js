module.exports = (sequelize, DataTypes) => {
    const TaskReminder = sequelize.define('TaskReminder', {
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remindAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING, // ex: 'push', 'email', 'sms'
        allowNull: false,
        defaultValue: 'push',
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    TaskReminder.associate = (models) => {
      TaskReminder.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
    };
  
    return TaskReminder;
  };
  