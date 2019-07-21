'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', 
  [
    {
      name: 'Irelia',
      cpf: '12345678998',
      phone: '(51)912345678',
    },
    {
      name: 'Fiora',
      cpf: '67899812345',
      phone: '(51)956781234',
    }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
