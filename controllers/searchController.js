const Recipe = require('../models/Recipe');
const { Op } = require('sequelize');

const searchRecipes = async (req, res) => {
    const searchQuery = req.query.q;
    try {
        let recipes;
        if (searchQuery.includes(':')) {
            // Search for recipes based on cooking time
            recipes = await Recipe.findAll({
                where: {
                    cookingTime: { [Op.lte]: searchQuery },
                },
            });
        } else if (!isNaN(searchQuery)) {
            // Search for recipes based on servings
            recipes = await Recipe.findAll({
                where: {
                    servings: { [Op.like]: parseInt(searchQuery) },
                },
            });
        } else {
            // Search for recipes based on title or name
            recipes = await Recipe.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${searchQuery}%` } },
                        { name: { [Op.like]: `%${searchQuery}%` } },
                    ],
                },
            });
        }
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { searchRecipes };