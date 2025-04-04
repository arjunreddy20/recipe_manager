const express = require('express');
const { getFollowers, getFollowing, getRecipesByAuthorId, getFavoritesByAuthorId, removeFollower,unfollow,getCollectionByAuthorId,getFeed } = require('../controllers/dashboradController');
const router = express.Router();

router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.get('/recipes', getRecipesByAuthorId);
router.get('/recipes/favorites', getFavoritesByAuthorId);
router.get('/my-collections',getCollectionByAuthorId)
router.post('/remove-follower', removeFollower);
router.post('/unfollow',unfollow)
router.get('/recipes/:id',getFeed);

module.exports = router;