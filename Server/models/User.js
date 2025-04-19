import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'team-member'],
    default: 'team-member'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  try {
    console.log('Pre-save hook triggered for user:', this.email);

    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) {
      console.log('Password not modified, skipping hashing');
      return next();
    }

    console.log('Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  try {
    console.log('Generating JWT token for user:', this.email);
    const token = jwt.sign(
      { id: this._id, role: this.role },
      process.env.JWT_SECRET || 'fallback_secret_for_development',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    console.log('JWT token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    console.log('Comparing passwords for user:', this.email);
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

export default mongoose.model('User', UserSchema);
