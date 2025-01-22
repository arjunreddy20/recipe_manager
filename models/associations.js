const User = require('./User');
const Recipe = require('./Recipe');
const Review = require('./Review');
const FollowRequest = require('./FollowRequest'); // Import the FollowRequest model
const favorates = require("./Collection");
const MyCollection = require("./myCollection");
const Like = require("./Like");

Recipe.hasMany(Review, { foreignKey: 'recipeId', as: 'Reviews' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'User' });
User.hasMany(Recipe, { foreignKey: 'userId', as: 'Recipes' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'Recipe' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'User' });

Recipe.belongsToMany(User, { through: favorates, as: 'Favorites' });
User.belongsToMany(Recipe, { through: favorates, as: 'Favorites' });
favorates.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'Recipe' });
Recipe.hasMany(favorates, { foreignKey: 'recipeId', onDelete: 'CASCADE' });

MyCollection.belongsTo(User, { foreignKey: 'userId', as: 'User' });
MyCollection.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'Recipe' });
User.hasMany(MyCollection, { foreignKey: 'userId', as: 'MyCollections' });
Recipe.hasMany(MyCollection, { foreignKey: 'recipeId', as: 'MyCollections' });

Like.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'Recipe' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'User' });


User.hasMany(FollowRequest, { foreignKey: 'authorId', as: 'FollowRequests' });
User.hasMany(FollowRequest, { foreignKey: 'userId', as: 'FollowingRequests' });
FollowRequest.belongsTo(User, { foreignKey: 'authorId', as: 'Author' });
FollowRequest.belongsTo(User, { foreignKey: 'userId', as: 'Follower' });
