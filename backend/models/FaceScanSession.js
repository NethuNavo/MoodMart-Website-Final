const mongoose = require('mongoose');

const FaceScanSessionSchema = new mongoose.Schema({
  mood: String,
  confidence: Number,
  result: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('FaceScanSession', FaceScanSessionSchema, 'facescansessions');
