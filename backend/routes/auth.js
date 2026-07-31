// =========================================================
// routes/auth.js — Signup and Login endpoints
// =========================================================

const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ---- Helper: generate a JWT token ----
// A JWT token is a signed string that proves the user is logged in.
// It contains the user's ID and expires after 7 days.
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// =========================================================
// POST /api/auth/signup
// Body: { firstName, lastName, email, password, phone, role, specialty }
// =========================================================
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, specialty } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create new user — password gets hashed automatically by the pre-save hook
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role:      role || 'parent',
      specialty: specialty || '',
    });

    // Generate token and send it back along with basic user info
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
      },
    });

  } catch (error) {
    // Handle mongoose validation errors nicely
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// =========================================================
// POST /api/auth/login
// Body: { email, password }
// =========================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // .select('+password') overrides the select:false on the password field
    // so we can compare it. We ONLY do this here in the login route.
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Logged in successfully!',
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// =========================================================
// GET /api/auth/me — Get currently logged in user's profile
// This is a protected route — requires a valid token
// =========================================================
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
