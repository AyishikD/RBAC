const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

exports.authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Permission denied' });
  }
  next();
};

// In-memory token blacklist (temporary; will reset on server restart)
const blacklistFile = path.join(__dirname, '../data/blacklist.json');

// Load the blacklist file into memory
const loadBlacklist = () => {
  if (!fs.existsSync(blacklistFile)) {
    fs.writeFileSync(blacklistFile, JSON.stringify([])); // Initialize empty file if not exists
  }
  const data = fs.readFileSync(blacklistFile, 'utf-8');
  return JSON.parse(data);
};

// Save the blacklist back to the file
const saveBlacklist = (blacklist) => {
  fs.writeFileSync(blacklistFile, JSON.stringify(blacklist, null, 2));
};

// Add token to the blacklist
exports.logout = (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(400).json({ message: 'No token provided' });

  // Load current blacklist, add the token, and save
  const blacklist = loadBlacklist();
  if (!blacklist.includes(token)) {
    blacklist.push(token);
    saveBlacklist(blacklist);
  }

  res.json({ message: 'Logged out successfully' });
};

// Check if a token is blacklisted
exports.isTokenBlacklisted = (token) => {
  const blacklist = loadBlacklist();
  return blacklist.includes(token);
};

// Authenticate middleware with blacklist check integrated
exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    // Check if token is blacklisted
    if (exports.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Role-based authorization middleware
exports.authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Permission denied' });
  }
  next();
};