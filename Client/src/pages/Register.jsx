import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus, FiAlertCircle } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !email || !password) {
        setRegisterError('Please enter all fields');
        return;
      }

      if (password !== confirmPassword) {
        setRegisterError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setRegisterError('Password must be at least 6 characters');
        return;
      }

      console.log('Attempting to register with:', { name, email });

      // Show loading state
      setIsLoading(true);
      setRegisterError('');

      const result = await register({ name, email, password });
      console.log('Registration result:', result);

      // Hide loading state
      setIsLoading(false);

      if (result && result.success) {
        console.log('Registration successful, redirecting to login page');

        // Show success toast
        toast.success('Account created successfully! Please log in.');

        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 500);
      } else {
        setRegisterError(result?.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      setRegisterError('An unexpected error occurred during registration');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] page-transition relative z-10">
      <div className="bg-blue-950/30 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-blue-800/30 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/30 text-blue-300 mb-4 shadow-lg shadow-blue-600/20">
            <FiUserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-200 mt-2">Join our platform to manage your projects</p>
        </div>
        {registerError && (
          <div className="mb-6 p-4 bg-red-900/30 text-red-300 rounded-lg border border-red-800/50 flex items-center backdrop-blur-sm">
            <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{registerError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-blue-900/30 text-white placeholder-blue-300/50"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-blue-900/30 text-white placeholder-blue-300/50"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-blue-900/30 text-white placeholder-blue-300/50"
                placeholder="••••••••"
                required
              />
            </div>
            <p className="mt-1 text-xs text-blue-300">Password must be at least 6 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-blue-900/30 text-white placeholder-blue-300/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 w-full flex justify-center items-center shadow-lg shadow-blue-600/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus className="mr-2" /> Create Account
                </>
              )}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center">
          <p className="text-blue-200">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
