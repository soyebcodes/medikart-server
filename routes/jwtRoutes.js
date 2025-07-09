// POST /api/jwt

import jwt from "jsonwebtoken";

router.post("/jwt", (req, res) => {
  const user = req.body;

  if (!user?.email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.send({ token });
});
