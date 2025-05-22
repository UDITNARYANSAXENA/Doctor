import jwt from 'jsonwebtoken';

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    // Get token from headers (standard is 'authorization' header)
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach doctor ID to req object (preferably req.doctor, not req.body)
    req.doctor = { id: decoded.id };

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authDoctor;
