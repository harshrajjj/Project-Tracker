import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user, loadUserData } = useContext(AuthContext);
  const [waitingForAuth, setWaitingForAuth] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [authAttempted, setAuthAttempted] = useState(false);

  useEffect(() => {
    console.log('PrivateRoute - Auth state:', { isAuthenticated, loading, user: user ? `${user.name} (${user.role})` : 'none' });

    // If loading is done, we can make a decision
    if (!loading) {
      // If not authenticated, we'll try to load user data once
      if (!isAuthenticated && !authAttempted) {
        console.log('PrivateRoute - Not authenticated, attempting to load user data');
        setAuthAttempted(true);

        // Try to load user data
        loadUserData().then(success => {
          if (!success) {
            console.log('PrivateRoute - Failed to load user data, will redirect to login');
            // Wait a moment before redirecting to avoid flash of content
            setTimeout(() => {
              setRedirectToLogin(true);
            }, 300);
          } else {
            console.log('PrivateRoute - Successfully loaded user data');
            setWaitingForAuth(false);
          }
        });
      } else if (!isAuthenticated && authAttempted) {
        // We've already tried to load user data and failed
        console.log('PrivateRoute - Not authenticated after attempt, will redirect to login');
        setTimeout(() => {
          setRedirectToLogin(true);
        }, 300);
      } else {
        // If authenticated, we can show the protected content
        console.log('PrivateRoute - Authenticated, will render protected content');
        setWaitingForAuth(false);
      }
    }
  }, [isAuthenticated, loading, user, authAttempted, loadUserData]);

  if (redirectToLogin) {
    console.log('PrivateRoute - Redirecting to login');
    return <Navigate to="/login" />;
  }

  if (loading || waitingForAuth) {
    console.log('PrivateRoute - Still loading or waiting for authentication state');
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-blue-500 text-lg font-semibold">Verifying authentication...</p>
        <p className="text-gray-500 mt-2">Please wait while we check your credentials</p>
      </div>
    );
  }

  console.log('PrivateRoute - Authenticated, rendering protected content');
  return children;
};

export default PrivateRoute;
