'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.addColumn('contacts', 'contactingId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
          as: 'contactingId',
        },
      }),
      queryInterface.addColumn('contacts', 'contactId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
          as: 'contactId',
        },
      }),
      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('contacts', 'contactingId'),
      queryInterface.removeColumn('contacts', 'contactId')
    ])
  }
};
