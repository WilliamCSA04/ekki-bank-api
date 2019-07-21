'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', 
  [
    {
      name: 'Irelia',
      cpf: '12345678998',
      phone: '(51)912345678',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Fiora',
      cpf: '67899812345',
      phone: '(51)956781234',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
