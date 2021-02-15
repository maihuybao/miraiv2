'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Currencies', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.BIGINT,
        unique: true
      },
      money: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      exp: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      dailyTime: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      workTime: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Currencies');
  }
};