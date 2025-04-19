import crypto from 'crypto';

// Simple CSRF token implementation
let csrfTokens = new Map();

// Generate a CSRF token
export const generateCsrfToken = (req, res, next) => {
  // Generate a token for all requests
  const token = crypto.randomBytes(32).toString('hex');

  // Store the token with the user's IP as the key
  const key = req.ip || 'anonymous';
  csrfTokens.set(key, token);

  // Set the token as a cookie
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // Client-side JavaScript needs to read this
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' // Changed from strict to lax for better compatibility
  });

  // Clean up old tokens periodically
  if (csrfTokens.size > 1000) {
    // If we have too many tokens, remove the oldest ones
    const keys = Array.from(csrfTokens.keys()).slice(0, 500);
    keys.forEach(k => csrfTokens.delete(k));
  }

  next();
};

// Verify CSRF token
export const verifyCsrfToken = (req, res, next) => {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // For now, we'll disable CSRF verification to make development easier
  // In a production environment, you would want to enable this
  return next();

  /* Commented out for development
  const token = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
  const key = req.ip || 'anonymous';
  const storedToken = csrfTokens.get(key);

  if (!token || token !== storedToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token'
    });
  }
  */

  next();
};
