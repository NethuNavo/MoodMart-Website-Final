const mongoose = require('mongoose');

const AudioTrackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  description: String,
  color: String,
  image: String,
  audioUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('AudioTrack', AudioTrackSchema);
