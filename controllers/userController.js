const Recipe = require('../models/Recipe');
const User = require('../models/User');

const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User  not found' });
    await user.update({ name, email });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };