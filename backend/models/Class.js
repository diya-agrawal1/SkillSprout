// =========================================================
// models/Class.js — Class listing data structure
// =========================================================

const mongoose = require('mongoose');

// A "schedule slot" is one time slot for a class
// e.g. { days: 'Mon & Wed', time: '4:00 PM', duration: 60, slotsTotal: 12 }
const scheduleSlotSchema = new mongoose.Schema({
  days:       { type: String, required: true },
  time:       { type: String, required: true },
  duration:   { type: Number, required: true },  // in minutes
  slotsTotal: { type: Number, required: true },
  slotsFilled:{ type: Number, default: 0 },
});

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Class title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['art', 'music', 'dance', 'coding', 'sports', 'drama'],
    },
    instructor: {
      // ref: 'User' links this field to the User collection.
      // This is like a foreign key in SQL.
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ageMin: { type: Number, required: true },
    ageMax: { type: Number, required: true },
    price:  {
      type: Number,
      required: true,
      min: 0,
    },
    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
    },
    location: {
      type: String,
      default: '',   // empty for online classes
    },
    schedule: [scheduleSlotSchema],   // array of schedule slots
    whatYoullLearn: [String],         // array of bullet points
    status: {
      type: String,
      enum: ['active', 'draft', 'paused'],
      default: 'draft',
    },
    // Rating is calculated from reviews — stored here for fast filtering
    averageRating: { type: Number, default: 0 },
    totalReviews:  { type: Number, default: 0 },
    emoji: { type: String, default: '🎓' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
