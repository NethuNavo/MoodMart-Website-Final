const mongoose = require('mongoose');

const ShopProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  price: Number,
  rating: Number,
  reviews: Number,
  description: String,
  tag: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('ShopProduct', ShopProductSchema, 'shopproducts');
