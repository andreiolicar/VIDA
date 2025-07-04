'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableExists = tables.includes('password_resets');

    if (!tableExists) {
      await queryInterface.createTable('password_resets', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        code: {
          type: Sequelize.STRING(6),
          allowNull: false,
        },
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        used: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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

      try {
        await queryInterface.addIndex('password_resets', ['email'], {
          name: 'password_resets_email_idx'
        });
      } catch (error) {
        console.log('Índice email já existe ou erro:', error.message);
      }

      try {
        await queryInterface.addIndex('password_resets', ['code'], {
          name: 'password_resets_code_idx'
        });
      } catch (error) {
        console.log('Índice code já existe ou erro:', error.message);
      }

      try {
        await queryInterface.addIndex('password_resets', ['expiresAt'], {
          name: 'password_resets_expires_idx'
        });
      } catch (error) {
        console.log('Índice expiresAt já existe ou erro:', error.message);
      }

      try {
        await queryInterface.addIndex('password_resets', ['userId'], {
          name: 'password_resets_user_idx'
        });
      } catch (error) {
        console.log('Índice userId já existe ou erro:', error.message);
      }
    } else {
      console.log('Tabela password_resets já existe, pulando criação...');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('password_resets');
  },
};