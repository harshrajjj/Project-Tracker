import User from '../models/User.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log('Register request received:', { ...req.body, password: '***' });

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: role || 'team-member' // Default to team-member if role not specified
    });

    console.log('User created successfully:', { id: user._id, name: user.name, email: user.email, role: user.role });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log('Login request received:', { ...req.body, password: '***' });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Login failed: Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Login successful:', { id: user._id, name: user.name, email: user.email, role: user.role });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  try {
    console.log('Logging out user');

    // Clear the token cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
      httpOnly: true,
      path: '/',
      sameSite: 'lax'
    });

    console.log('Token cookie cleared');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

    console.log('Logout response sent');
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    console.log('Getting current user profile');

    if (!req.user || !req.user.id) {
      console.log('No user found in request object');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    console.log('Finding user with ID:', req.user.id);
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', { id: user._id, name: user.name, email: user.email, role: user.role });

    res.status(200).json({
      success: true,
      data: user
    });

    console.log('User profile sent successfully');
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    console.log('Generating token for user:', user.email);
    // Create token
    const token = user.getSignedJwtToken();
    console.log('Token generated successfully');

    const cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRE || 30);
    console.log('Cookie will expire in', cookieExpire, 'days');

    const options = {
      expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: '/',
      sameSite: 'lax' // Helps with CSRF protection
    };

    // Set secure flag in production
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    console.log('Setting cookie with options:', options);

    // Create response object with user data
    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    console.log('Sending response with token and user data');

    // Set cookie and send response
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json(responseData);

    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error in sendTokenResponse:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating authentication token'
    });
  }
};
