const express = require('express');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  const { date, mood, intensity, stressLevel, notes } = req.body;

  if (!mood || typeof intensity !== 'number') {
    return res.status(400).json({ msg: 'Mood and intensity are required' });
  }

  try {
    const moodEntry = new MoodEntry({
      date: date ? String(date) : new Date().toISOString().split('T')[0],
      mood: String(mood),
      intensity,
      stressLevel: typeof stressLevel === 'number' ? stressLevel : undefined,
      notes: typeof notes === 'string' ? notes : undefined,
      userId: req.user?._id,
      userEmail: req.user?.email,
    });

    const savedEntry = await moodEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error('Mood entry save failed:', err);
    res.status(500).json({ msg: 'Server error', error: err.message || err });
  }
});

module.exports = router;
