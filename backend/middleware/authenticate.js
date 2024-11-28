const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../controllers/authController');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Check if the token is blacklisted
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded payload to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticate;
