import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  try {
    console.log('Auth middleware - Request path:', req.path);
    console.log('Auth middleware - Headers:', JSON.stringify(req.headers));

    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Auth middleware - Token found in cookies');
    }
    // Check for token in headers
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware - Token found in Authorization header');
    }
    // Check for token in query params (for testing only)
    else if (req.query && req.query.token) {
      token = req.query.token;
      console.log('Auth middleware - Token found in query params');
    }

    // Make sure token exists
    if (!token) {
      console.log('Auth middleware - No token found');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }

    console.log('Auth middleware - Token found, verifying...');
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');
    console.log('Auth middleware - Token verified, user ID:', decoded.id);

    // Add user to request object
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('Auth middleware - User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found in database'
      });
    }

    console.log('Auth middleware - User found:', user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    console.error('Error stack:', err.stack);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed - ' + err.message
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};
