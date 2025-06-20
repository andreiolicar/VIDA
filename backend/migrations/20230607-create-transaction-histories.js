'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TransactionHistories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Transactions', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      fieldName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      oldValue: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      newValue: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      changedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('TransactionHistories');
  },
};
