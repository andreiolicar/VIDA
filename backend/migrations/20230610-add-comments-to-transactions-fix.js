'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Transactions', 'comments', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    } catch (error) {
      console.log('Coluna comments já existe, ignorando erro.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'comments');
  },
};
