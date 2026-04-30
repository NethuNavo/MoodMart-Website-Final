const mongoose = require('mongoose');

const QASessionSchema = new mongoose.Schema({
  id: String,
  topic: String,
  coach: String,
  date: String,
  time: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('QASession', QASessionSchema, 'qasessions');
