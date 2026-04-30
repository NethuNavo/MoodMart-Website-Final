const mongoose = require('mongoose');

const CommunityQuestionSchema = new mongoose.Schema({
  id: String,
  question: String,
  answer: String,
  coach: String,
  timeAgo: String,
  saves: Number,
  isSaved: Boolean
}, { timestamps: true });

module.exports = mongoose.model('CommunityQuestion', CommunityQuestionSchema, 'communityquestions');
