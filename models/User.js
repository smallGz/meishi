'use strict';
module.exports = (sequelize, DataTypes) => {

  const UserModel = sequelize.define('UserModel', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        defaultValue: ''
      },
      password: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        defaultValue: ''
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdIpAt: {
        type: DataTypes.CHAR(15),
        allowNull: false,
        defaultValue: ''
      },
      updatedIpAt: {
        type: DataTypes.CHAR(15),
        allowNull: false,
        defaultValue: ''
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      avatar:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:''
      }
  }, {
    freezeTableName: true,      
    tableName: 'user',       
    timestamps: false  
  });
  UserModel.associate = function(models) {
    // associations can be defined here
  };
  return UserModel;
};