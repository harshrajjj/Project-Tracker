import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { useEffect } from 'react'
import { pingServer } from './utils/serverWakeup'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProjectDetails from './pages/ProjectDetails'
import TaskDetails from './pages/TaskDetails'
import NotFound from './pages/NotFound'
// TestAuth page removed

// Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import PrivateRoute from './components/routing/PrivateRoute'
import ErrorBoundary from './components/common/ErrorBoundary'

// Context
import { AuthProvider } from './context/AuthContext'

function App() {
  // Ping the server when the app loads to wake it up
  useEffect(() => {
    // Wait a short moment after the app loads before pinging
    const timer = setTimeout(() => {
      pingServer();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-white relative overflow-hidden flex flex-col animated-gradient">
          <div className="pulse-1"></div>
          <div className="pulse-2"></div>
          <div className="pulse-3"></div>
          <ErrorBoundary>
            <Header />
            <main className="pt-24 pb-8 relative z-10 flex-grow">
              <ToastContainer
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnHover
                draggable
                className="toast-container-custom"
                style={{ top: '4.5rem' }}
              />
            <Routes>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
              {/* TestAuth route removed */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <ErrorBoundary><Dashboard /></ErrorBoundary>
                </PrivateRoute>
              } />
              <Route path="/projects/:id" element={
                <PrivateRoute>
                  <ErrorBoundary><ProjectDetails /></ErrorBoundary>
                </PrivateRoute>
              } />
              <Route path="/tasks/:id" element={
                <PrivateRoute>
                  <ErrorBoundary><TaskDetails /></ErrorBoundary>
                </PrivateRoute>
              } />
              <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
            </Routes>
            </main>
            <Footer />
          </ErrorBoundary>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
