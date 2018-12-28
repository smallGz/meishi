const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('favorite', [
      {
        id: 1,
        userId: 1,
        cookbookId: 3,
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 2,
        userId: 2,
        cookbookId: 1,
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 3,
        userId: 2,
        cookbookId: 3,
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 4,
        userId: 2,
        cookbookId: 2,
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('favorite', null, {});
  }
};
