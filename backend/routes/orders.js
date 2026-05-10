const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticate } = require('../middleware/auth');

// Create order (authenticated users only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { products, total, paymentMethod } = req.body;
    const userEmail = req.user.email;

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    if (!total || typeof total !== 'number') {
      return res.status(400).json({ error: 'Total amount is required' });
    }

    // Create new order
    const order = new Order({
      user: userEmail,
      products,
      total,
      status: paymentMethod === 'stripe' ? 'processing' : 'pending',
      paymentMethod: paymentMethod || 'cod'
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/user-orders', authenticate, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const orders = await Order.find({ user: userEmail }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify user owns this order
    if (order.user !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only - for future use)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
