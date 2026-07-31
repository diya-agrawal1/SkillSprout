// =========================================================
// server.js — The heart of the SkillSprout backend
// This file starts the server and connects everything together
// =========================================================

// dotenv reads your .env file and makes those values available
// via process.env.VARIABLE_NAME throughout your entire app
require('dotenv').config({ path: './backend/.env' });

const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Import the database connection function
const connectDB = require('./config/db');

// Import all route files
const authRoutes       = require('./routes/auth');
const classRoutes      = require('./routes/classes');
const enrollmentRoutes = require('./routes/enrollments');
const reviewRoutes     = require('./routes/reviews');

// ---- Create the Express app ----
const app = express();

// ---- Connect to MongoDB ----
connectDB();

// ---- Middleware ----
// Middleware are functions that run on EVERY request before it
// reaches your route handlers. Think of them as checkpoints.

// cors() allows your frontend (running on a different port or domain)
// to make requests to this backend. Without this, browsers block it.
app.use(cors());

// express.json() parses incoming request bodies that are in JSON format.
// Without this, req.body would be undefined when someone sends JSON data.
app.use(express.json());

// Serve your frontend HTML/CSS/JS files as static files.
// When someone visits http://localhost:5000, they get your frontend.
app.use(express.static(path.join(__dirname, '../frontend')));

// ---- API Routes ----
// All routes starting with /api/auth   → handled by auth.js
// All routes starting with /api/classes → handled by classes.js
// etc.
app.use('/api/auth',        authRoutes);
app.use('/api/classes',     classRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reviews',     reviewRoutes);

// ---- Catch-all route ----
// If someone navigates directly to /browse or /dashboard in the browser,
// serve the frontend and let it handle routing.
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// ---- Start the server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SkillSprout server running on http://localhost:${PORT}`);
});
