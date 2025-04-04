const User = require('../models/User');
const FollowRequest = require('../models/FollowRequest');
const Recipe = require('../models/Recipe');
const Favorite = require('../models/Collection');
const MyCollection = require('../models/myCollection');
const {Op} = require("sequelize");

const getFollowers = async (req, res) => {
  try {
    const {userId} = req.params;
    const followers = await FollowRequest.findAll({
      where: { authorId: userId, status: 'accepted' },
      include: [
        {
          model: User,
          as: 'Follower',
          attributes: ['id', 'name'],
        },
      ],
    });
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const {userId} =req.params;
    const following = await FollowRequest.findAll({
      where: { userId, status: 'accepted' },
      include: [
        {
          model: User,
          as: 'Author',
          attributes: ['id', 'name'],
        },
      ],
    });
    res.json(following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecipesByAuthorId = async (req, res) => {
  try {
    const authorId = req.query.authorId;
    const recipes = await Recipe.findAll({
      where: { userId: authorId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['name'],
        },
      ],
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFavoritesByAuthorId = async (req,res) => {
    try{
        const authorId = req.query.authorId;
        const favorites = await Favorite.findAll({
            where: { userId: authorId },
            include: [
                {
                    model: Recipe,
                    as: 'Recipe',
                    attributes: ['id', 'title', 'ingredients', 'instructions', 'cookingTime', 'servings', 'image', 'userId', 'name'],
                },
            ],
        });
        res.json(favorites);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getCollectionByAuthorId = async (req,res) => {
    try {
        const { authorId } = req.query;
        const myCollections = await MyCollection.findAll({
          where: { userId: authorId },
          include: [
            {
              model: Recipe,
              as: 'Recipe',
              attributes: ['id', 'title', 'ingredients', 'instructions', 'cookingTime', 'servings', 'image', 'userId', 'name'],
            },
          ],
        });
        res.json(myCollections);
    }  catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeFollower = async (req,res) => {
    try{
        const {followerId, userId} = req.body;
        await FollowRequest.destroy({ where: { authorId: userId, userId: followerId } });
        res.json({message: 'Follower removed successfully'});
    }catch{
        res.status(500).json({ error: error.message });
    }
};

const unfollow = async (req, res) => {
    try {
      const { userId, authorId } = req.body;
      await FollowRequest.destroy({ where: { userId, authorId } });
      res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getFeed = async (req,res) => {
  const {id} = req.params; 
  try{
    const allAuthors = await FollowRequest.findAll({where:{userId:id,status:"accepted"}})
    const recentRecipes=[]
    for (author=0;author < allAuthors.length; author++){
      const recipeUserId = allAuthors[author].authorId;
      const recentRecipe = await Recipe.findAll({
        where: {
          userId: recipeUserId,
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          }
        }
      });
      recentRecipes.push(...recentRecipe);
    }
    res.json(recentRecipes);
    
  }catch(error){
    console.log(error)
    res.status(500).json({error:error.message})
  }
};

module.exports = { getFollowers, getFollowing, getRecipesByAuthorId, getFavoritesByAuthorId ,getCollectionByAuthorId, removeFollower,unfollow, getFeed};