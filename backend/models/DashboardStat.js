const mongoose = require('mongoose');

const DashboardStatSchema = new mongoose.Schema({
  user: String,
  averageStress: Number,
  streak: Number,
  recommendations: [String],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DashboardStat', DashboardStatSchema, 'dashboardstats');
