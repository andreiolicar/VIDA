'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskCollaborators', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
          model: 'users', // nome da tabela, não do model
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.STRING, // Ex: 'owner', 'editor', 'viewer'
        allowNull: false,
        defaultValue: 'editor',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskCollaborators');
  },
};
