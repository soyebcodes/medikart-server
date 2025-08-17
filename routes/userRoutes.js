const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { getIO } = require("../utils/socket");

// Middleware example to check admin (you can enhance this)
const verifyAdmin = (req, res, next) => {
  // You would get user info from req.user after JWT verification (to implement later)
  // For now, you can simulate by sending admin header or skip for now
  if (req.headers["x-admin"] === "true") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

// Get all users - Admin only
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude sensitive info if any
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Register new user
// POST /api/users -> for new user registration
router.post("/", async (req, res) => {
  try {
    const { email, username, role = "user", photo } = req.body;

    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Email and username are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ email, username, role, photo });
    await newUser.save();

    res.status(201).json({ message: "User registered", user: newUser });
    const io = getIO();
    io.emit("notification", {
      type: "new_user",
      message: `New user registered: ${newUser.username}`,
      user: { email: newUser.email, username: newUser.username },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

router.get("/role/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.send({
        role: user.role,
        username: user.username,
        photo: user.photo,
      });
    } else {
      res.status(404).send({
        role: null,
        username: null,
        photo: null,
      });
    }
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

// PUT /api/users/:email  --> to save or update user
router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ email }, userData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    res.status(200).json({ message: "User saved/updated", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save user", error: error.message });
  }
});

// Update user role - Admin only
router.patch("/role/:email", verifyAdmin, async (req, res) => {
  const { email } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
