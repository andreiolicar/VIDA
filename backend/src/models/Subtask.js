// models/Subtask.js
module.exports = (sequelize, DataTypes) => {
    const Subtask = sequelize.define('Subtask', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks', // nome da tabela de tarefas
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      tableName: 'subtasks',
      timestamps: true,
    });
  
    Subtask.associate = (models) => {
      Subtask.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
    };
  
    return Subtask;
  };
  