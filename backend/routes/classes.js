// =========================================================
// routes/classes.js — Class listing endpoints
// =========================================================

const express = require('express');
const Class   = require('../models/Class');
const { protect, instructorOnly } = require('../middleware/auth');

const router = express.Router();

// =========================================================
// GET /api/classes — Browse all classes with filters
// Query params: category, ageMin, ageMax, priceMax, mode, rating, sort
// Example: /api/classes?category=dance&mode=offline&priceMax=1500
// =========================================================
router.get('/', async (req, res) => {
  try {
    const { category, mode, priceMax, minRating, sort, search } = req.query;

    // Build a filter object dynamically based on what was sent
    const filter = { status: 'active' };

    if (category)  filter.category = category;
    if (mode)      filter.mode = mode;
    if (priceMax)  filter.price = { $lte: Number(priceMax) };
    if (minRating) filter.averageRating = { $gte: Number(minRating) };

    // Text search on title and description
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },  // i = case insensitive
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 };  // default: newest first
    if (sort === 'rating')     sortOption = { averageRating: -1 };
    if (sort === 'price-low')  sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };

    // .populate('instructor', 'firstName lastName') replaces the instructor
    // ObjectId with the actual user data (just name fields)
    const classes = await Class.find(filter)
      .populate('instructor', 'firstName lastName')
      .sort(sortOption);

    res.json({ count: classes.length, classes });

  } catch (error) {
    res.status(500).json({ message: 'Server error fetching classes.' });
  }
});

// =========================================================
// GET /api/classes/:id — Get a single class by ID
// =========================================================
router.get('/:id', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('instructor', 'firstName lastName bio experience specialty');

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    res.json({ class: classItem });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// =========================================================
// POST /api/classes — Create a new class (instructors only)
// =========================================================
router.post('/', protect, instructorOnly, async (req, res) => {
  try {
    const {
      title, description, category, ageMin, ageMax,
      price, mode, location, schedule, whatYoullLearn, emoji
    } = req.body;

    const newClass = await Class.create({
      title, description, category,
      ageMin, ageMax, price, mode,
      location: location || '',
      schedule:       schedule || [],
      whatYoullLearn: whatYoullLearn || [],
      emoji:          emoji || '🎓',
      instructor:     req.user._id,  // from the auth middleware
      status: 'draft',
    });

    res.status(201).json({ message: 'Class created!', class: newClass });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// =========================================================
// PUT /api/classes/:id — Update a class (owner only)
// =========================================================
router.put('/:id', protect, instructorOnly, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    // Make sure only the instructor who owns this class can edit it
    if (classItem.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own classes.' });
    }

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // new:true returns the updated document
    );

    res.json({ message: 'Class updated!', class: updated });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// =========================================================
// DELETE /api/classes/:id — Delete a class (owner only)
// =========================================================
router.delete('/:id', protect, instructorOnly, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    if (classItem.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own classes.' });
    }

    await classItem.deleteOne();
    res.json({ message: 'Class deleted.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// =========================================================
// GET /api/classes/instructor/my-classes — Get logged in instructor's classes
// =========================================================
router.get('/instructor/my-classes', protect, instructorOnly, async (req, res) => {
  try {
    const classes = await Class.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json({ classes });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
