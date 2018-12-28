const md5 = require('md5');
const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('comment', [
      {
        id: 1,
        userId: 1,
        cookbookId: 1,
        title: 'title-11111111',
        content: 'content-11111111',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 2,
        userId: 2,
        cookbookId: 1,
        title: 'title-2222222222',
        content: 'content-222222222',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 3,
        userId: 3,
        cookbookId: 1,
        title: 'title-33333333',
        content: 'content-3333333333',
        createdIpAt: '192.168.1.11',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 4,
        userId: 1,
        cookbookId: 2,
        title: 'title-44444444',
        content: 'content-444444444',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 5,
        userId: 1,
        cookbookId: 1,
        title: 'title-555555555',
        content: 'content-555555555',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 6,
        userId: 2,
        cookbookId: 3,
        title: 'title-66666666666',
        content: 'content-6666666666',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 7,
        userId: 2,
        cookbookId: 2,
        title: 'title-7777777777',
        content: 'content-77777777777',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 8,
        userId: 4,
        cookbookId: 1,
        title: 'title-8888888888',
        content: 'content-888888888',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 9,
        userId: 4,
        cookbookId: 2,
        title: 'title-99999999',
        content: 'content-9999999999',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 10,
        userId: 3,
        cookbookId: 3,
        title: 'title-10-10-10-10-10-10',
        content: 'content--10-10-10-10-10-10',
        createdIpAt: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('comment', null, {});
  }
};
