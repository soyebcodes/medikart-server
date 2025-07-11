
export const verifySeller = (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).send('Forbidden: Sellers only');
  }
  next();
};