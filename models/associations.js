// models/associations.js
const User = require('./User');
const Recipe = require('./Recipe');
const Review = require('./Review');
const Collection = require("./Collection")


Recipe.hasMany(Review, { foreignKey: 'recipeId', as: 'Reviews' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'User' });
User.hasMany(Recipe, { foreignKey: 'userId', as: 'Recipes' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'Recipe' });


Recipe.belongsToMany(User, { through: Collection, as: 'Favorites' });
User .belongsToMany(Recipe, { through: Collection, as: 'Favorites' });
Collection.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'Recipe' });

Recipe.hasMany(Collection, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
module.exports = { Recipe, Review, User };