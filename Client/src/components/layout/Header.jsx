import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiHome, FiGrid, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      // Show loading state or feedback if needed

      // Call logout function
      await logout();

      // Close mobile menu
      setMobileMenuOpen(false);

      // Redirect to home page if needed
      // You can uncomment this if you want to redirect after logout
      // window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, we still want to close the mobile menu
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-400 font-medium' : 'text-blue-100 hover:text-blue-300';
  };

  const NavLink = ({ to, icon, children }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-colors ${isActive(to)}`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );

  const authLinks = (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink to="/dashboard" icon={<FiGrid className="text-lg" />}>Dashboard</NavLink>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-white">
            {user?.name}
            {user?.role === 'admin' && <span className="ml-1 text-xs text-white bg-blue-600 px-1.5 py-0.5 rounded-full">Admin</span>}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-900/30 rounded-md transition-colors"
          aria-label="Logout"
        >
          <FiLogOut className="mr-1.5" /> Logout
        </button>
      </div>
    </div>
  );

  const mobileAuthLinks = (
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <NavLink to="/dashboard" icon={<FiGrid className="text-lg" />}>Dashboard</NavLink>
      <div className="flex items-center space-x-2 py-2 px-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-white">
          {user?.name}
          {user?.role === 'admin' && <span className="ml-1 text-xs text-white bg-blue-600 px-1.5 py-0.5 rounded-full">Admin</span>}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center py-2 px-3 text-base font-medium text-red-300 hover:text-red-200 hover:bg-red-900/30 rounded-md transition-colors"
        aria-label="Logout"
      >
        <FiLogOut className="mr-2" /> Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/login" className={`py-2 px-3 rounded-md transition-colors ${isActive('/login')}`}>
        Login
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-600/20"
      >
        Register
      </Link>
    </div>
  );

  const mobileGuestLinks = (
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <NavLink to="/login" icon={<FiUser className="text-lg" />}>Login</NavLink>
      <Link
        to="/register"
        className="flex items-center space-x-2 py-2 px-3 text-base font-medium text-blue-300 hover:bg-blue-800/50 rounded-md"
      >
        <span>Register</span>
      </Link>
    </div>
  );

  return (
    <header className="bg-blue-950/60 backdrop-blur-md border-b border-blue-800/50 fixed top-0 left-0 right-0 w-full z-50 shadow-lg shadow-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold mr-2 shadow-lg shadow-blue-500/20 overflow-hidden">
                  <img src="/logo.svg" alt="ProjectTaskr Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold text-white">ProjectTaskr</span>
              </div>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink to="/" icon={<FiHome className="text-lg" />}>Home</NavLink>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex">
            {isAuthenticated ? authLinks : guestLinks}
          </nav>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-950/30 backdrop-blur-sm border-b border-blue-800/30 relative z-50">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink to="/" icon={<FiHome className="text-lg" />}>Home</NavLink>
          </div>
          {isAuthenticated ? mobileAuthLinks : mobileGuestLinks}
        </div>
      )}
    </header>
  );
};

export default Header;
