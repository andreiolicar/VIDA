'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'comments', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'recurring', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Transactions', 'comments');
    await queryInterface.removeColumn('Transactions', 'recurring');
  },
};
