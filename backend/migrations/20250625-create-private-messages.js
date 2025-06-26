module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PrivateMessages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      senderUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // nome da tabela de usuários
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', // sugerido para manter integridade referencial
      },
      receiverUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', // idem
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PrivateMessages');
  },
};