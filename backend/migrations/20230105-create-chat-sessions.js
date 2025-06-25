'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.sequelize.query(
      `SHOW TABLES LIKE 'ChatSessions';`
    );
    if (tableExists[0].length === 0) {
      await queryInterface.createTable('ChatSessions', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        area: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        topics: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        messages: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
          // defaultValue removido
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ChatSessions');
  },
};

