// =========================================================
// config/db.js — MongoDB connection
// =========================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() opens a connection to your MongoDB database.
    // process.env.MONGO_URI reads the value from your .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process if database connection fails —
    // there's no point running the server without a database.
    process.exit(1);
  }
};

module.exports = connectDB;
