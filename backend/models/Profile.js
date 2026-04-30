const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: String,
  totalEntries: Number,
  currentStreak: Number,
  averageStress: Number,
  wellnessScore: Number,
  achievements: [String],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema, 'profiles');
