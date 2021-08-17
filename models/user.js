'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         User.hasMany(models.Transaction, {
            foreignKey: 'userId',
         });
      }
   }
   User.init(
      {
         email: DataTypes.STRING,
         password: DataTypes.STRING,
         listAs: DataTypes.STRING,
         fullname: DataTypes.STRING,
         gender: DataTypes.STRING,
         phone: DataTypes.STRING,
         address: DataTypes.STRING,
         isAdmin: DataTypes.BOOLEAN,
         subscribe: DataTypes.STRING,
         photoprofile: DataTypes.STRING,
      },
      {
         sequelize,
         modelName: 'User',
      }
   );
   return User;
};
