const User = require("../models/User");

// Save or update user on login/signup
const upsertUser = async (req, res) => {
  const { email } = req.params;
  const userData = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: userData },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "User upsert failed", error: err.message });
  }
};

module.exports = { upsertUser };
