const express = require("express");
const router = express.Router();
const { upsertUser } = require("../controllers/userController");

router.put("/:email", upsertUser); // Save user after login/signup

module.exports = router;
