// =========================================================
// middleware/auth.js — JWT Authentication middleware
//
// This function runs BEFORE protected route handlers.
// It checks if the request has a valid login token.
// If yes → let the request through.
// If no  → send back a 401 Unauthorized error.
// =========================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Tokens are sent in the Authorization header like:
    // "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not logged in. Please log in to continue.' });
    }

    // Extract the token part (after "Bearer ")
    const token = authHeader.split(' ')[1];

    // jwt.verify() decodes the token and checks it hasn't been tampered with.
    // If it's invalid or expired, it throws an error caught by the catch block.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object so route handlers can use it.
    // select('-password') ensures the password hash is never loaded.
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    // Call next() to pass control to the actual route handler
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

// Middleware to restrict access to instructors only
const instructorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Instructors only.' });
  }
};

module.exports = { protect, instructorOnly };
