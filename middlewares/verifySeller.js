const User = require('../models/User'); // or your user model

const verifySeller = async (req, res, next) => {
  try {
    const email = req.user?.email;
    const user = await User.findOne({ email });

    if (user?.role !== 'seller') {
      return res.status(403).send('Forbidden: Not a seller');
    }

    next();
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = { verifySeller };
