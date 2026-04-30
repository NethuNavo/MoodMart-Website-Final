const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  message: { type: String, required: true },
  icon: String,
  mood: String
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
