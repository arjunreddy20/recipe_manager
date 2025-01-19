const express = require('express');
const {
  createReview,
  getReviewsByRecipeId,
  getAverageRatingByRecipeId,
} = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createReview);
router.get('/recipe/:recipeId', getReviewsByRecipeId);
router.get('/average-rating/:recipeId', getAverageRatingByRecipeId);

module.exports = router;