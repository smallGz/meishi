'use strict';
const UserModel = require('./User.js');
module.exports = (sequelize, DataTypes) => {
  const UserProfileModel = sequelize.define('UserProfileModel', {
   id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        defaultValue: 0,
        references : {
          model:UserModel,
          key:"id"
        }
      },
      avatar: {
        type: DataTypes.CHAR(20),
        allowNull: true,
        defaultValue: ''
      },
      mobile: {
        type: DataTypes.CHAR(12),
        unique: true,
        allowNull: true,
        defaultValue: ''
      },
      email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true,
        defaultValue: ''
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      realname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      gender: {
        type: DataTypes.ENUM(['男','女','保密']),
        allowNull: false,
        defaultValue: '保密'
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
  }, {
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
    tableName: 'user-profile',       
    timestamps: false  
  });
  UserProfileModel.associate = function(models) {
    // associations can be defined here
  };
  return UserProfileModel;
};

