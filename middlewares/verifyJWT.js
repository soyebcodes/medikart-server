import jwt from "jsonwebtoken";
// Middleware to verify JWT token

export const verifyJWT = (req, res, next) => {
  console.log("Auth header:", req.headers.authorization);  // Add this line
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Unauthorized");
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Forbidden");
    req.user = decoded;
    next();
  });
};
