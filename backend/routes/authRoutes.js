const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Import Sequelize models
const router = express.Router();
require('dotenv').config();

// POST /login
router.post('/login', async (req, res) => {
  const { army_number, password } = req.body;

  try {
    // Find the user by Army Number using Sequelize
    const user = await db.User.findOne({
      where: { army_number },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid Army Number or password.' });
    }

    // Validate password using bcrypt
    const isPasswordValid = password==user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Army Number or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, name:user.name, army_number: user.army_number },
      process.env.JWT_SECRET
    );

    // Send the token in the response
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

module.exports = router;