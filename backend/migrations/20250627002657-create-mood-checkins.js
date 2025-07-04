'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MoodCheckins', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      mood: {
        type: Sequelize.ENUM('feliz', 'ok', 'triste', 'irritado'),
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MoodCheckins');
  },
};
