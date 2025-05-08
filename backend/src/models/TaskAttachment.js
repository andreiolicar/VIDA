module.exports = (sequelize, DataTypes) => {
    const TaskAttachment = sequelize.define('TaskAttachment', {
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING, // ex: 'image', 'document', 'link'
        allowNull: false,
      },
    });
  
    TaskAttachment.associate = (models) => {
      TaskAttachment.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
    };
  
    return TaskAttachment;
  };
  