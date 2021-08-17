'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Music extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         Music.belongsTo(models.Artist, { as: 'artist' });
      }
   }
   Music.init(
      {
         title: DataTypes.STRING,
         year: DataTypes.STRING,
         thumbnail: DataTypes.STRING,
         artistId: DataTypes.INTEGER,
         attache: DataTypes.STRING,
         genre: DataTypes.STRING,
      },
      {
         sequelize,
         modelName: 'Music',
      }
   );
   return Music;
};
