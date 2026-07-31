// =========================================================
// models/User.js — User data structure
//
// A Mongoose "model" defines the shape of documents stored
// in a MongoDB collection. Think of it like a blueprint.
// Every user saved to the database must match this structure.
// =========================================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,           // removes accidental leading/trailing spaces
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,         // no two users can have the same email
      lowercase: true,      // always store emails in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,        // IMPORTANT: password is never returned in queries by default
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['parent', 'instructor'],   // only these two values allowed
      default: 'parent',
    },
    // Instructor-specific fields (only filled when role === 'instructor')
    specialty: {
      type: String,
      enum: ['art', 'music', 'dance', 'coding', 'sports', 'drama', ''],
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    experience: {
      type: Number,   // years of experience
      default: 0,
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ---- Pre-save hook: hash password before saving ----
// This runs automatically BEFORE every .save() call.
// It converts "mypassword123" → "$2b$10$..." (a secure hash).
// You can NEVER reverse a hash back to the original password —
// that's the whole point. To verify login, you hash the input
// and compare it to the stored hash.
userSchema.pre('save', async function (next) {
  // Only hash if password was actually changed (not on other updates)
  if (!this.isModified('password')) return next();

  // 10 = "salt rounds" — higher is more secure but slower
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ---- Instance method: compare passwords at login ----
// We add a custom method to every User document.
// Usage: const isMatch = await user.comparePassword(enteredPassword);
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
