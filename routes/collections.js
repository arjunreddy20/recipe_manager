const express = require('express');
const { createCollection, deleteCollection, getUserCollections,unsaveRecipe } = require('../controllers/collectionController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createCollection);
router.delete('/:recipeId', deleteCollection);
router.get('/', getUserCollections);
router.delete('/', unsaveRecipe);

module.exports = router;