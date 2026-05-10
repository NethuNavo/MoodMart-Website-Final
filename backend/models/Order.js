const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  products: [
    {
      productId: String,
      quantity: Number
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
