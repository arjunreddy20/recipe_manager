const Review = require('../models/Review');
const Recipe = require('../models/Recipe');

const createReview = async (req, res) => {
  try {
    let { recipeId, rating, comment,userId } = req.body;
    if (rating === null || rating === '') {
      rating = 0;
    }
    if (comment === null || comment === '') {
      comment = '';
    }
    const review = await Review.create({ recipeId, rating, comment, userId});
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


module.exports = { createReview };