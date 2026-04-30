const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  user: String,
  emailNotifications: Boolean,
  appNotifications: Boolean,
  promotionalEmails: Boolean,
  theme: String,
  language: String,
  fontSize: String,
  dataSharing: Boolean,
  activityStatus: Boolean,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema, 'settings');
