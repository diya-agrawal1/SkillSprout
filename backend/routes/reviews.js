// =========================================================
// routes/reviews.js — Review endpoints
// =========================================================

const express  = require('express');
const { Review } = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews/:classId — Get all reviews for a class
router.get('/:classId', async (req, res) => {
  try {
    const reviews = await Review.find({ class: req.params.classId })
      .populate('parent', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/reviews — Submit a review (parents only)
router.post('/', protect, async (req, res) => {
  try {
    const { classId, rating, comment } = req.body;

    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Only parents can leave reviews.' });
    }

    const existing = await Review.findOne({ class: classId, parent: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this class.' });
    }

    const review = await Review.create({
      class:   classId,
      parent:  req.user._id,
      rating,
      comment,
    });

    // populate parent name before sending back
    await review.populate('parent', 'firstName lastName');

    res.status(201).json({ message: 'Review submitted!', review });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
