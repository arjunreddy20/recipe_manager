const express = require('express');
const {
  createRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  addLike,
  followInvite,
  fetchInvites,
  acceptInvite,
  rejectInvite,
} = require('../controllers/recipeController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createRecipe);
router.get('/', authenticate, getAllRecipes);
router.put('/:id', authenticate, updateRecipe);
router.delete('/:id', authenticate, deleteRecipe);
router.post('/like', authenticate, addLike);
router.post('/follow', authenticate, followInvite);
router.get('/invites/:userId', authenticate, fetchInvites);
router.post('/invites/accept', authenticate, acceptInvite);
router.post('/invites/reject', authenticate, rejectInvite);

module.exports = router;
