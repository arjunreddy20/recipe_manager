const express = require('express');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', authenticate, updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;