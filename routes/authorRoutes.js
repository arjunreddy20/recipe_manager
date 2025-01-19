const express = require('express');
const { getAuthors } = require('../controllers/authorController');
const router = express.Router();

router.get('/', getAuthors);

module.exports = router;