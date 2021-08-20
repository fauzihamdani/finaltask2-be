'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('transactions', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         attachment: {
            type: Sequelize.STRING,
         },
         startDate: {
            type: Sequelize.DATE,
         },
         lastLoginDate: {
            type: Sequelize.DATE,
         },
         dueDate: {
            type: Sequelize.DATE,
         },
         user_status: {
            type: Sequelize.STRING,
         },
         payment_status: {
            type: Sequelize.STRING,
         },
         action: {
            type: Sequelize.STRING,
         },
         userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('transactions');
   },
};
