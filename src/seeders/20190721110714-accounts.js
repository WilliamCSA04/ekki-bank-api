'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('accounts', [{
    number: "12345678",
    userId: 1,
    balance: 1000.00,
    limit: 500.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    number: "56781234",
    userId: 2,
    balance: 1000.00,
    limit: 500.00,
    createdAt: new Date(),
    updatedAt: new Date()
  }]),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('accounts', null, {})
};
