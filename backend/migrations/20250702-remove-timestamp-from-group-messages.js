module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('group_messages');
    
    if (tableDescription.timestamp) {
      await queryInterface.removeColumn('group_messages', 'timestamp');
      console.log('✅ Campo timestamp removido com sucesso');
    } else {
      console.log('ℹ️ Campo timestamp já não existe');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('group_messages', 'timestamp', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },
};