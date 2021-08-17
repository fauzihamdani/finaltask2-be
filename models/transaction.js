'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Transaction extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         Transaction.belongsTo(models.User, {
            as: 'user',
         });
      }
   }
   Transaction.init(
      {
         attachment: DataTypes.STRING,
         startDate: DataTypes.DATE,
         lastLoginDate: DataTypes.DATE,
         dueDate: DataTypes.DATE,
         user_status: DataTypes.STRING,
         payment_status: DataTypes.STRING,
         action: DataTypes.STRING,
         userId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'Transaction',
      }
   );
   return Transaction;
};
