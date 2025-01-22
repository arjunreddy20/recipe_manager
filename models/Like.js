const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Like extends Model {}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    recipeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Recipes',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Like',
    timestamps: false,
  }
);

module.exports = Like;