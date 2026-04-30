const mongoose = require('mongoose');

const BreathingSessionSchema = new mongoose.Schema({
  durationMinutes: Number,
  cycles: Number,
  completed: Boolean,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BreathingSession', BreathingSessionSchema, 'breathingsessions');
