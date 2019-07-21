'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', 
  [
    {
      name: 'Irelia',
      cpf: 'irelia@mail.com',
      phone: '(51)912345678',
    },
    {
      fullName: 'Fiora',
      email: 'fiora@mail.com',
      password: '(51)956781234',
    }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
