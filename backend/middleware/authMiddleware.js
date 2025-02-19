const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      console.error('Access denied. No token provided.');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Remove the "Bearer " prefix if present
    const token = authHeader.replace('Bearer ', '');

    // Debugging: Log the extracted token
    console.log('Extracted token:', token);

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);


      // Check if the user's role is allowed
      if (roles.length && !roles.includes(decoded.role)) {
        console.error('Access denied. Insufficient permissions.');
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }

      // Attach the decoded user information to the request object
      req.user = decoded;

      next();
    } catch (err) {
      // Debugging: Log token verification errors
      console.error('Token verification error:', err.message);
      res.status(400).json({ error: 'Invalid token.' });
    }
  };
};

module.exports = authMiddleware;