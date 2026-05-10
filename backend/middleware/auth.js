const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getTokenFromHeader = (req) => {
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1];
  return req.header('x-auth-token') || req.body.token || req.query.token || null;
};

exports.authenticate = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable is not set');
    return res.status(500).json({ msg: 'Server configuration error: JWT_SECRET not set' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ msg: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error', err.message || err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Authorization required' });
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
  next();
};

module.exports = exports;
