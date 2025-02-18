const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user's role is allowed
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }

      // Attach the decoded user information to the request object
      req.user = decoded;
      next();
    } catch (err) {
      res.status(400).json({ error: 'Invalid token.' });
    }
  };
};

module.exports = authMiddleware;