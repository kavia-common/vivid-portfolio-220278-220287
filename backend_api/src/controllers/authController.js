'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// PUBLIC_INTERFACE
async function login(req, res, next) {
  /** Login with email and password, returns JWT */
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function me(req, res) {
  /** Return the current user payload info from JWT. */
  return res.json({ user: req.user });
}

module.exports = { login, me };
