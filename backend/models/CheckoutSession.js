const mongoose = require('mongoose');

const CheckoutSessionSchema = new mongoose.Schema({
  user: String,
  paymentMethod: String,
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CheckoutSession', CheckoutSessionSchema, 'checkoutsessions');
