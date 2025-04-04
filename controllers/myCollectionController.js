
const MyCollection = require('../models/myCollection');
const { Op } = require('sequelize');
const Recipe = require('../models/Recipe');

const createMyCollection = async (req, res) => {
  try {
    const { collectionGroupName, userId } = req.body;
    const myCollection = await MyCollection.create({ collectionGroupName, userId });
    res.status(201).json(myCollection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addRecipeToMyCollection = async (req, res) => {
  try {
    const {  collectionId,recipeId,userId } = req.body;
    console.log(req.body)
    const collection = await MyCollection.findOne({ where: { id: collectionId } });
    collectionGroupName = collection.collectionGroupName;
    console.log(collectionGroupName)
    const existingMyCollection = await MyCollection.findOne({ where: {id: collectionId,recipeId} });

    if (existingMyCollection) {
      return res.status(400).json({ error: 'Recipe is already in this collection' });
    }
    const myCollection = await MyCollection.create({ collectionGroupName,recipeId,userId });
    res.status(201).json(myCollection);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

const getMyCollections = async (req, res) => {
  try {
    const { userId } = req.query;
    const myCollections = await MyCollection.findAll({
      where: { userId: userId },
      include: [
        {
          model: Recipe,
          as: 'Recipe',
          attributes: ['id', 'title', 'ingredients', 'instructions', 'cookingTime', 'servings', 'image', 'userId', 'name'],
        },
      ],
    });
    res.json(myCollections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeRecipeFromCollection = async (req, res) => {
  try {
    const groupName = req.params.groupName;
    const recipeId = req.params.recipeId;

    await MyCollection.destroy({ where: { collectionGroupName:groupName,recipeId:recipeId } });
    res.status(200).json({ message: 'Recipe removed from collection' });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

const getRecipesForCollection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const groupName = req.params.groupName;
    const recipes = await MyCollection.findAll({
      where: { userId, collectionGroupName: groupName,recipeId: { [Op.ne]: null } },
      include: [
        {
          model: Recipe,
          as: 'Recipe',
        },
      ],
    });
    res.json(recipes.map(recipe => recipe.Recipe));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createMyCollection, addRecipeToMyCollection, getMyCollections,removeRecipeFromCollection,getRecipesForCollection };