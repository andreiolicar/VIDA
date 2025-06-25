'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'ChatSessions';

    // Função para verificar se coluna existe
    async function hasColumn(columnName) {
      const query = `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${tableName}' AND COLUMN_NAME = '${columnName}';
      `;
      const [results] = await queryInterface.sequelize.query(query);
      return results.length > 0;
    }

    if (!(await hasColumn('description'))) {
      await queryInterface.addColumn(tableName, 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (!(await hasColumn('area'))) {
      await queryInterface.addColumn(tableName, 'area', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!(await hasColumn('topics'))) {
      await queryInterface.addColumn(tableName, 'topics', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('ChatSessions', 'description');
    await queryInterface.removeColumn('ChatSessions', 'area');
    await queryInterface.removeColumn('ChatSessions', 'topics');
  },
};
