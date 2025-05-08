'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskReminders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks', // nome da tabela, não do model
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      remindAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING, // Ex: 'push', 'email', 'sms'
        allowNull: false,
        defaultValue: 'push',
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskReminders');
  },
};
