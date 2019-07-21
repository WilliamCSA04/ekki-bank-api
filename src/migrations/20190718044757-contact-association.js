'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.addColumn('contacts', 'contactingId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'contactingId',
          through: 'Contact',
        },
      }),
      queryInterface.addColumn('contacts', 'contactedId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'contactedId',
          through: 'Contact',
        },
      }),
      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('contacts', 'contactingId'),
      queryInterface.removeColumn('contacts', 'contactedId')
    ])
  }
};
