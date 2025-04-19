import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

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
import PrivateRoute from './components/routing/PrivateRoute'
import ErrorBoundary from './components/common/ErrorBoundary'

// Context
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <Header />
            <main className="py-8">
              <ToastContainer position="top-right" autoClose={3000} />
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
          </ErrorBoundary>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
