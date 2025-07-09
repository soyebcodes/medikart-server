const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  role: { type: String, default: "user", enum: ["user", "seller", "admin"] },
  photo: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
