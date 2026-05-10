const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log('Registration attempt for:', email);

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save(); // Password is automatically hashed by the pre-save hook

    console.log('User saved, generating token...');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ msg: 'Server configuration error: JWT_SECRET not set' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });
    console.log('Registration successful for user:', email);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message || 'Unknown error' });
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message || 'Unknown error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt received:', {
    email: email || '(empty)',
    passwordProvided: !!password,
    bodyKeys: Object.keys(req.body)
  });

  if (!email || !password) {
    console.log('Login validation failed - missing email or password');
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    console.log('Normalized email:', normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found:', normalizedEmail);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('User found, comparing password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', normalizedEmail);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('Password matched, generating token...');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ msg: 'Server configuration error: JWT_SECRET not set' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });
    console.log('Login successful for user:', normalizedEmail);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err.message || err);
    res.status(500).json({ msg: 'Server error', error: err.message || 'Unknown error' });
  }
});

module.exports = router;
