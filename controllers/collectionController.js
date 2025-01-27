const Collection = require('../models/Collection');
const Recipe = require('../models/Recipe');

const createCollection = async (req, res) => {
  const { recipeId, userId } = req.body;
  console.log(req.body)
  if (!userId) {
    return res.status(400).json({ error: 'User  ID is required' });
  }
  try {
    const collection = await Collection.create({ recipeId, userId });
    res.status(201).json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { recipeId, userId } = req.body;
    await Collection.destroy({ where: { recipeId, userId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserCollections = async (req, res) => {
  try {
    const { userId } = req.query;
    const collections = await Collection.findAll({
      where: { userId },
      include: [
        {
          model: Recipe,
          as: 'Recipe',
          attributes: ['id', 'title', 'ingredients', 'instructions', 'cookingTime', 'servings', 'image', 'userId', 'name'],
        },
      ],
    });
  
    const savedRecipes = Object.values(collections).map(collection => collection.Recipe.id).filter((id, index, self) => self.indexOf(id) === index);
    //console.log(savedRecipes);
    res.json({ collections, savedRecipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const unsaveRecipe = async (req, res) => {
  try {
    const { recipeId, userId } = req.body;
    await Collection.destroy({ where: { recipeId, userId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createCollection, deleteCollection, getUserCollections,unsaveRecipe };