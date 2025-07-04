'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'recurring', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }).catch(() => {
      // Ignora erro caso a coluna já exista
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Transactions', 'recurring');
  },
};
