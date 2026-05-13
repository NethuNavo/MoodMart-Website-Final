const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  mood: { type: String, required: true },
  intensity: { type: Number, required: true },
  stressLevel: { type: Number },
  notes: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: String
}, { timestamps: true });

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
