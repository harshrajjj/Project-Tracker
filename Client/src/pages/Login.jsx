import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setLoginError('Please enter all fields');
        return;
      }

      console.log('Attempting to login with:', { email });

      // Show loading state
      setIsLoading(true);
      setLoginError('');

      const result = await login({ email, password });
      console.log('Login result:', result);

      // Hide loading state
      setIsLoading(false);

      if (result && result.success) {
        console.log('Login successful, redirecting to dashboard');

        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setLoginError(result?.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      setLoginError('An unexpected error occurred during login');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] page-transition">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <FiLogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>

        {loginError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 w-full flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" /> Sign in
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="text-center text-xs text-gray-500">
            <p>Demo Admin Account:</p>
            <p className="font-mono bg-gray-50 p-2 rounded mt-1">admin@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
