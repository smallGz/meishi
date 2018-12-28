'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user','avatar', {
      type:Sequelize.STRING,
      allowNull:false,
      defaultValue:''
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user','avatar');
  }
};