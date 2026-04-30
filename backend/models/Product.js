const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['book', 'journal', 'essential-oil', 'supplement'], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: String,
  tag: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
