'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmptyName(value){
            nameIsEmptyOrNull = !value
            if(nameIsEmptyOrNull){
              throw new Error("The user has to have a name")
            }
          }
        }
      },
      cpf: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        validate: {
          is: /^\d{3}\d{3}\d{3}\d{2}$/
        }
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          is: /^[(]{0,1}[0-9]{1,2}[)]{0,1}[0-9]*$/
        }
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
    return queryInterface.dropTable('users');
  }
};