// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
      }

      // Verify using the secret variable
      const decoded = jwt.verify(token, secret);

      const userId = decoded.id || decoded._id;
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

module.exports = { protect };