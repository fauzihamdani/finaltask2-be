'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Users', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         email: {
            type: Sequelize.STRING,
         },
         password: {
            type: Sequelize.STRING,
         },
         listAs: {
            type: Sequelize.STRING,
         },
         fullname: {
            type: Sequelize.STRING,
         },
         gender: {
            type: Sequelize.STRING,
         },
         phone: {
            type: Sequelize.STRING,
         },
         address: {
            type: Sequelize.STRING,
         },
         isAdmin: {
            type: Sequelize.BOOLEAN,
         },
         subscribe: {
            type: Sequelize.STRING,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         photoprofile: {
            type: Sequelize.STRING,
         },
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Users');
   },
};
