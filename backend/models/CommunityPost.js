const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
  id: String,
  author: String,
  category: String,
  title: String,
  content: String,
  likes: Number,
  replies: Number,
  timeAgo: String,
  moodTag: String,
  isLiked: Boolean
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', CommunityPostSchema, 'communityposts');
