// =========================================================
// routes/enrollments.js — Enrollment endpoints
// =========================================================

const express    = require('express');
const { Enrollment } = require('../models/Enrollment');
const Class      = require('../models/Class');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/enrollments — Enroll in a class
router.post('/', protect, async (req, res) => {
  try {
    const { classId, childName, childAge, scheduleSlot } = req.body;

    // Check class exists and has slots
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      parent: req.user._id,
      class:  classId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You are already enrolled in this class.' });
    }

    const enrollment = await Enrollment.create({
      parent:       req.user._id,
      class:        classId,
      childName,
      childAge,
      scheduleSlot,
    });

    res.status(201).json({ message: 'Enrolled successfully!', enrollment });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/enrollments/my — Get current parent's enrollments
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ parent: req.user._id })
      .populate('class', 'title category emoji price instructor')
      .sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/enrollments/:id — Cancel enrollment
router.delete('/:id', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    if (enrollment.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your enrollment.' });
    }

    enrollment.status = 'cancelled';
    await enrollment.save();

    res.json({ message: 'Enrollment cancelled.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
