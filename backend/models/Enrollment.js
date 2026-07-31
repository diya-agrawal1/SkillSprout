// =========================================================
// models/Enrollment.js — Tracks which parent enrolled which child
// =========================================================

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    childName: { type: String, required: true },
    childAge:  { type: Number, required: true },
    scheduleSlot: { type: String },   // which time slot they chose
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// A parent can only enroll the same child in the same class once
enrollmentSchema.index({ parent: 1, class: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// =========================================================
// models/Review.js — Parent reviews for a class
// =========================================================

const reviewSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// One review per parent per class
reviewSchema.index({ class: 1, parent: 1 }, { unique: true });

// After saving a review, automatically update the class's averageRating
// This is a "post save hook" — runs after the review is saved
reviewSchema.post('save', async function () {
  const Class  = require('./Class');
  const Review = mongoose.model('Review');

  const stats = await Review.aggregate([
    { $match: { class: this.class } },
    { $group: { _id: '$class', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Class.findByIdAndUpdate(this.class, {
      averageRating: Math.round(stats[0].avg * 10) / 10,
      totalReviews:  stats[0].count,
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Enrollment, Review };
