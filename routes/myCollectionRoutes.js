// routes/myCollectionRoutes.js
const express = require('express');
const { createMyCollection, addRecipeToMyCollection, getMyCollections, removeRecipeFromCollection,getRecipesForCollection } = require('../controllers/myCollectionController');
const router = express.Router();

router.post('/', createMyCollection);
router.post('/add-recipe', addRecipeToMyCollection);
router.get('/', getMyCollections)
router.delete('/remove-recipe/:groupName/:recipeId', removeRecipeFromCollection);
router.get('/:userId/:groupName/recipes', getRecipesForCollection);

module.exports = router;