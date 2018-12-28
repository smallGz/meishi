'use strict';
module.exports = (sequelize, Sequelize) => {
  
  const CategoryModel = sequelize.define('CategoryModel', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      pid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
     freezeTableName: true,      
      tableName: 'category',       
      timestamps: false 
  });
  return CategoryModel;
};