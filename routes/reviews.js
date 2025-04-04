const express = require('express');
const {
  createReview,
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/', createReview);
//router.get('/recipe/:recipeId', getReviewsByRecipeId);
//router.get('/average-rating/:recipeId', getAverageRatingByRecipeId);

module.exports = router;