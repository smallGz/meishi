'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('login-log', {
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
      loginIpAt: {
        type: Sequelize.CHAR(15),
        allowNull: false,
        defaultValue: ''
      },
      loginAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }, {
      tableName: 'login-log',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      timestamp: false,
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('login-log');
  }
};