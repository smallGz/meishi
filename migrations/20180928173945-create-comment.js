'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      cookbookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: false,
        defaultValue: ''
      },
      createdIpAt: {
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
      tableName: 'comment',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comment');
  }
};