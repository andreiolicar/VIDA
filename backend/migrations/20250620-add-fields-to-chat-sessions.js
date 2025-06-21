'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona coluna 'description' do tipo TEXT, aceita NULL
    await queryInterface.addColumn('ChatSessions', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Adiciona coluna 'area' do tipo STRING, aceita NULL
    await queryInterface.addColumn('ChatSessions', 'area', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Adiciona coluna 'topics' do tipo TEXT, aceita NULL (armazenará JSON stringificado)
    await queryInterface.addColumn('ChatSessions', 'topics', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    // Remove as colunas adicionadas no rollback
    await queryInterface.removeColumn('ChatSessions', 'description');
    await queryInterface.removeColumn('ChatSessions', 'area');
    await queryInterface.removeColumn('ChatSessions', 'topics');
  },
};