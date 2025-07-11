export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send('Forbidden: Admins only');
  }
  next();
};