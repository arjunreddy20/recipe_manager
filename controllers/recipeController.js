const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const User = require('../models/User');
const Collection = require("../models/Collection")

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
          attributes: ['rating', 'comment', 'recipeId'],
        },
      ],
      attributes: ['id', 'title', 'ingredients', 'instructions', 'cookingTime', 'servings', 'image', 'userId', 'name'],
    });
    //console.log(recipes)
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: [
        {
          model: Review,
          as: 'Reviews',
          attributes: ['rating', 'comment', 'recipeId'],
        },
      ],
    });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    const reviews = recipe.Reviews;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    recipe.averageRating = averageRating;
    res.json(recipe);
  } catch (error) {
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
    await recipe.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe };