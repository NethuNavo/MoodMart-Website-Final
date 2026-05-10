const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, description, image, tag, rating, reviews } = req.body;
    
    // Validate required fields
    if (!name || !category || !price || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const product = new Product({
      name,
      category,
      price,
      description,
      image,
      tag,
      rating: rating || 0,
      reviews: reviews || 0
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, description, image, tag, rating, reviews } = req.body;
    
    let product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (description) product.description = description;
    if (image) product.image = image;
    if (tag !== undefined) product.tag = tag;
    if (rating !== undefined) product.rating = rating;
    if (reviews !== undefined) product.reviews = reviews;
    
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
