'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('favorite', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cookbookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdIpAt: {
        type: Sequelize.CHAR(15),
        allowNull: false,
        defaultValue: ''
      },
      updatedIpAt: {
        type: Sequelize.CHAR(15),
        allowNull: false,
        defaultValue: ''
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      tableName: 'favorite',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('favorite');
  }
};