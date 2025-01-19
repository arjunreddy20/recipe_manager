const express = require('express');
const { searchRecipes } = require('../controllers/searchController');
const router = express.Router();

router.get('/', searchRecipes);

module.exports = router;