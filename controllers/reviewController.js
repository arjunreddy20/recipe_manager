const Review = require('../models/Review');
const Recipe = require('../models/Recipe');
const associations = require('../models/associations');
const User = require('../models/User');

const createReview = async (req, res) => {
  try {
    let { recipeId, rating, comment } = req.body;
    if (rating === null || rating === '') {
      rating = 0;
    }
    if (comment === null || comment === '') {
      comment = '';
    }
    const review = await Review.create({ recipeId, rating, comment });
    const recipe = await Recipe.findByPk(recipeId);
    const reviews = await Review.findAll({ where: { recipeId } });
    const ratedReviews = reviews.filter(review => review.rating !== parseInt(0));
    const averageRating = ratedReviews.reduce((sum, review) => sum + review.rating, 0) / ratedReviews.length;
    await recipe.update({ averageRating });
    res.status(201).json({ recipe, averageRating });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to add review' });
  }
};

const getReviewsByRecipeId = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const reviews = await Review.findAll({ where: { recipeId } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAverageRatingByRecipeId = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const averageRating = await Review.sum('rating', { where: { recipeId } });
    const count = await Review.count({ where: { recipeId } });
    const average = averageRating / count;
    res.json({ averageRating: average });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createReview, getReviewsByRecipeId, getAverageRatingByRecipeId };