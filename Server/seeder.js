import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create admin user
const createAdminUser = async () => {
  try {
    // First check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    console.log('Admin user created:', admin.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Create team member
const createTeamMember = async () => {
  try {
    // First check if team member already exists
    const memberExists = await User.findOne({ email: 'team@example.com' });
    
    if (memberExists) {
      console.log('Team member already exists');
      process.exit();
    }
    
    const member = await User.create({
      name: 'Team Member',
      email: 'team@example.com',
      password: 'password123',
      role: 'team-member'
    });
    
    console.log('Team member created:', member.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all users
const deleteUsers = async () => {
  try {
    await User.deleteMany();
    console.log('All users removed');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-a') {
  createAdminUser();
} else if (process.argv[2] === '-t') {
  createTeamMember();
} else if (process.argv[2] === '-d') {
  deleteUsers();
} else {
  console.log('Please provide a valid command:');
  console.log('  -a: Create admin user');
  console.log('  -t: Create team member');
  console.log('  -d: Delete all users');
  process.exit();
}
