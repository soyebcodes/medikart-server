const express = require("express");
const router = express.Router();
const { upsertUser } = require("../controllers/userController");
const User = require("../models/User");

router.put("/:email", upsertUser); // Save user after login/signup

// get user role based
router.get("/role/:email", async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (user) {
    res.send({ role: user.role });
  } else {
    res.status(404).send({ role: null });
  }
});


module.exports = router;
