'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Threads', {
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
      threadID: {
        type: Sequelize.BIGINT,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
      },
      settings: {
        type: Sequelize.JSON
      },
      banned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      time2unban: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      reasonban: {
        type: Sequelize.STRING,
        defaultValue: null
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Threads');
  }
};