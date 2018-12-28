'use strict';
const UserModel = require('./User.js');
module.exports = (sequelize, DataTypes) => {
  const cookbookModel = sequelize.define('cookbookModel', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        references : {
          model:UserModel,
          key:"id"
        }
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      covers: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '成品图片'
      },
      description: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        defaultValue: '',
        comments: '介绍'
      },
      craft: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '工艺'
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '难度'
      },
      taste: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '口味'
      },
      needTime: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '耗时'
      },
      cookers: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '厨具'
      },
      ingredients: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        comments: '原料'
      },
      steps: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        defaultValue: '',
        comments: '步骤'
      },
      tips: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        defaultValue: '',
        comments: '小窍门'
      },
      favoriteCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comments: '收藏数量'
      },
      commentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comments: '评论数量'
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
    tableName: 'cookbook',       
    timestamps: false  
  });
  cookbookModel.associate = function(models) {
    // associations can be defined here
  };
  return cookbookModel;
};

