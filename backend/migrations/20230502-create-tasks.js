'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      priority: {
        type: Sequelize.STRING, // 'alta', 'media', 'baixa'
        allowNull: false,
        defaultValue: 'media',
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING, // 'a_fazer', 'fazendo', 'feito'
        allowNull: false,
        defaultValue: 'a_fazer',
      },
      recurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      listId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TaskLists', // nome da tabela, não do model
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // nome da tabela, não do model
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks');
  },
};
