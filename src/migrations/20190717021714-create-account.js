'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      balance: {
        allowNull: false,
        type: Sequelize.NUMERIC,
        defaultValue: 1000.00,
        validate: {min: 0, isNumeric: true}
      },
      limit: {
        allowNull: false,
        type: Sequelize.NUMERIC,
        defaultValue: 500.00,
        validate: {min: 0, max: 500, isNumeric: true}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('accounts');
  }
};