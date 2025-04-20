import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

// Use axiosInstance instead of axios throughout this file
// import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store token in localStorage
  const setToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          console.log('No token found in localStorage');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Set the token in axios headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token found in localStorage, attempting to verify');

        const res = await axiosInstance.get('/auth/me');
        console.log('User loaded successfully:', res.data);

        setUser(res.data.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        console.error('Error loading user:', err);
        setToken(null); // Clear invalid token
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // This function will be used to manually load user data after login/register
  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('AuthContext: Manually loading user data');
      const res = await axiosInstance.get('/auth/me');
      console.log('User data loaded manually:', res.data);

      if (res.data && res.data.data) {
        setUser(res.data.data);
        setIsAuthenticated(true);
        console.log('AuthContext: User data loaded successfully');
        setLoading(false);
        return true;
      } else {
        console.error('AuthContext: Invalid user data format');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Error loading user data manually:', err);
      setLoading(false);
      return false;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      console.log('AuthContext: Registering user with data:', { ...userData, password: '***' });
      const res = await axiosInstance.post('/auth/register', userData);
      console.log('AuthContext: Registration response:', res.data);

      if (res.data && res.data.user) {
        // Don't automatically log in after registration
        console.log('Registration successful, but not automatically logging in');

        // Don't set token or load user data
        // This ensures the user needs to explicitly log in after registration

        setError(null);
        return { ...res.data, success: true };
      } else {
        const errorMsg = 'Invalid response format from server';
        console.error('AuthContext: Registration error:', errorMsg, res.data);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('AuthContext: Registration error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      console.log('AuthContext: Logging in user with email:', userData.email);

      // Set a longer timeout for login requests to handle Render's cold start
      const res = await axiosInstance.post('/auth/login', userData);
      console.log('AuthContext: Login response:', res.data);

      if (res.data && res.data.user) {
        // Save token to localStorage and set in axios headers
        if (res.data.token) {
          console.log('Setting token in localStorage');
          setToken(res.data.token);

          // Wait a moment for the token to be set
          await new Promise(resolve => setTimeout(resolve, 300));

          // Load user data to ensure authentication state is updated
          await loadUserData();
        }

        setError(null);
        return { ...res.data, success: true };
      } else {
        const errorMsg = 'Invalid response format from server';
        console.error('AuthContext: Login error:', errorMsg, res.data);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      console.log('AuthContext: Logging out user');

      // Try to call the logout endpoint, but don't wait for it to complete
      // This prevents the 404 error from blocking the logout process
      axiosInstance.get('/auth/logout')
        .then(() => console.log('Logout API call successful'))
        .catch(error => console.log('Logout API call failed, but continuing with client-side logout:', error.message));

      // Immediately clear client-side auth state
      // Clear token from localStorage and axios headers
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      console.log('AuthContext: User logged out successfully on client side');
    } catch (err) {
      console.error('AuthContext: Logout error:', err);
      // Even if there's an error, clear everything on the client side
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        loadUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
