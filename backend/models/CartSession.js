const mongoose = require('mongoose');

const CartSessionSchema = new mongoose.Schema({
  user: String,
  items: [
    {
      productId: String,
      quantity: Number,
      price: Number
    }
  ],
  subtotal: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CartSession', CartSessionSchema, 'cartsessions');
