const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const User = require('../models/User');
const Collection = require("../models/Collection");
const Like = require("../models/Like");
const MyCollection = require('../models/myCollection');
const FollowRequest = require('../models/FollowRequest'); 

const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, cookingTime, servings, image, userId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    const name = user.name;
    const recipe = await Recipe.create({ title, ingredients, instructions, cookingTime, servings, image, userId, name });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        {
          model: Review,
          as: 'Reviews',
          include: [
            {
              model: User,
              as: 'User',
            },
          ],
        },
      ],
    });
    
    const recipesWithLikes = await Promise.all(recipes.map(async recipe => {
      const likes = await getLikes(recipe.id);
      return { ...recipe.dataValues, likes };
    }));
    res.json(recipesWithLikes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions, cookingTime, servings, image } = req.body;
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    await recipe.update({ title, ingredients, instructions, cookingTime, servings, image });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    await Review.destroy({ where: { recipeId: id } });
    await Collection.destroy({ where: { recipeId: id } });
    await Like.destroy({ where: { recipeId: id } });
    await MyCollection.destroy({ where: { recipeId: id } });
    await recipe.destroy();
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const addLike = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;
    const existingLike = await Like.findOne({ where: { userId, recipeId } });
    if (existingLike) {
      return res.status(400).json({ error: 'You have already liked this recipe' });
    }
    const like = await Like.create({ userId, recipeId });
    res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const id = req;
    const likes = await Like.count({ where: { recipeId: id } });
    return likes;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const followInvite = async (req, res) => {
  try {
    const { authorId, userId } = req.body; 
    const followRequest = await FollowRequest.create({
      authorId,
      userId,
      status: 'pending', 
    });
    res.status(201).json({ message: 'Follow request sent successfully', followRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchInvites = async (req, res) => {
  try {
    const { userId } = req.params; 
    const invites = await FollowRequest.findAll({
      where: {
        authorId: userId,
        status: 'pending',
      },
      include: [
        {
          model: User,
          as: 'Author',
          attributes: ['id', 'name'], 
        },
        {
          model: User,
          as: 'Follower', 
          attributes: ['id', 'name'],
        },
      ],
    });
    res.status(200).json(invites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


const acceptInvite = async (req, res) => {
    const { inviteId } = req.body;
    try {
        const invite = await FollowRequest.findByPk(inviteId);
        if (!invite) return res.status(404).json({ error: 'Invite not found' });
        
        invite.status = 'accepted';
        await invite.save();
        res.status(200).json({ message: 'Invite accepted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rejectInvite = async (req, res) => {
    const { inviteId } = req.body;
    try {
        const invite = await FollowRequest.findByPk(inviteId);
        if (!invite) return res.status(404).json({ error: 'Invite not found' });
        
        invite.status = 'rejected';
        await invite.save();
        res.status(200).json({ message: 'Invite rejected successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    createRecipe, 
    getAllRecipes, 
    updateRecipe, 
    deleteRecipe, 
    addLike, 
    followInvite, 
    fetchInvites, 
    acceptInvite, 
    rejectInvite 
};

