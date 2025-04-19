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

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600';
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

      <div className="relative group">
        <div className="flex items-center space-x-1 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
            {user?.name}
            {user?.role === 'admin' && <span className="ml-1 text-xs text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">Admin</span>}
          </span>
        </div>

        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  const mobileAuthLinks = (
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <NavLink to="/dashboard" icon={<FiGrid className="text-lg" />}>Dashboard</NavLink>
      <div className="flex items-center space-x-2 py-2 px-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-gray-700">
          {user?.name}
          {user?.role === 'admin' && <span className="ml-1 text-xs text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">Admin</span>}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center py-2 px-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
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
        className="btn btn-primary"
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
        className="flex items-center space-x-2 py-2 px-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
      >
        <span>Register</span>
      </Link>
    </div>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold mr-2">PT</div>
                <span className="text-xl font-bold text-gray-900">ProjectTaskr</span>
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
        <div className="md:hidden">
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
