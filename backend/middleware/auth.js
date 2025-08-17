const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role || 'officer' };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
