const Recipe = require("../models/Recipe");

const getAuthors = async (req, res) => {
    try {
        const authors = await Recipe.findAll({
            attributes: ['name', 'userId'],
            group: ['name', 'userId'],
            order: [['name', 'ASC']],
        });
        //console.log(authors)
        const authorsWithRecipeCount = await Promise.all(authors.map(async (author) => ({
            name: author.name,
            recipeCount: await Recipe.count({ where: { name: author.name } }),
        })));
        res.json(authorsWithRecipeCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {getAuthors}