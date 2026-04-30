const mongoose = require('mongoose');

const OrderSuccessSchema = new mongoose.Schema({
  user: String,
  orderId: String,
  completed: Boolean,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('OrderSuccess', OrderSuccessSchema, 'ordersuccesses');
