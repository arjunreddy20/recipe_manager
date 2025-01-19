const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Collection extends Model {}

Collection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recipeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Recipe',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User ',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Collection',
    timestamps: false,
  }
);

module.exports = Collection;