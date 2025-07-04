'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WellnessHabits', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      frequency: {
        type: Sequelize.STRING,
      },
      target: {
        type: Sequelize.STRING,
      },
      currentValue: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WellnessHabits');
  },
};
