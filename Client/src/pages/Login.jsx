import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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

      // Show toast notification about potential delay
      toast.info(
        "The server might take up to a minute to start if it hasn't been used recently.",
        { autoClose: 10000 } // Keep the message visible for 10 seconds
      );

      const result = await login({ email, password });
      console.log('Login result:', result);

      // Hide loading state
      setIsLoading(false);

      if (result && result.success) {
        console.log('Login successful, redirecting to home page');

        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/');
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
    <div className="flex justify-center items-center min-h-[80vh] page-transition relative z-10">
      <div className="bg-blue-950/30 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-blue-800/30 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/30 text-blue-300 mb-4 shadow-lg shadow-blue-600/20">
            <FiLogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-blue-200 mt-2">Sign in to your account to continue</p>
        </div>

        {loginError && (
          <div className="mb-6 p-4 bg-red-900/30 text-red-300 rounded-lg border border-red-800/50 flex items-center backdrop-blur-sm">
            <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-blue-200 mb-1" htmlFor="password">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
            </div>
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
                  Signing in... This may take up to a minute if the server is starting up
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
          <p className="text-blue-200">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Create an account
            </Link>
          </p>
        </div>


      </div>
    </div>
  );
};

export default Login;
