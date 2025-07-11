export const verifyAdmin = (req, res, next) => {
  console.log("verifyAdmin req.user:", req.user);
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};


