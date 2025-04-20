import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FiCheckCircle, FiUsers, FiClipboard, FiLayers, FiArrowRight } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {isAuthenticated ? 'Welcome Back to ProjectTaskr' : 'Manage Projects & Tasks with Ease'}
              </h1>
              <p className="text-xl mb-8 text-indigo-100 max-w-xl">
                {isAuthenticated
                  ? 'Continue managing your projects and tasks. Track progress and collaborate with your team.'
                  : 'A comprehensive solution for teams to collaborate, track progress, and deliver projects on time.'}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold flex items-center justify-center shadow-lg shadow-blue-600/20"
                    >
                      Get Started <FiArrowRight className="ml-2" />
                    </Link>
                    <Link
                      to="/login"
                      className="px-6 py-3 rounded-lg bg-blue-900/50 hover:bg-blue-800/50 text-white border border-blue-700/50 font-semibold flex items-center justify-center backdrop-blur-sm"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold flex items-center justify-center shadow-lg shadow-blue-600/20"
                  >
                    Go to Dashboard <FiArrowRight className="ml-2" />
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-blue-900/20 backdrop-blur-sm rounded-xl p-1 shadow-xl shadow-blue-900/20 border border-blue-800/30">
                <div className="bg-blue-950/70 rounded-lg shadow-xl overflow-hidden border border-blue-800/30">
                  <div className="p-4 bg-blue-900/30 border-b border-blue-800/30">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <div className="ml-4 text-sm text-blue-300 font-medium">ProjectTaskr Dashboard</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Active Projects</h3>
                      <span className="bg-blue-600/50 text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full">3 Projects</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-300 mr-3">
                              <FiLayers className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-white">Website Redesign</span>
                          </div>
                          <span className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded border border-green-800/30">In Progress</span>
                        </div>
                      </div>
                      <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 mr-3">
                              <FiClipboard className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-white">Mobile App Development</span>
                          </div>
                          <span className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 rounded border border-yellow-800/30">Planning</span>
                        </div>
                      </div>
                      <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-600/30 flex items-center justify-center text-red-300 mr-3">
                              <FiUsers className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-white">Marketing Campaign</span>
                          </div>
                          <span className="bg-blue-600/30 text-blue-300 text-xs px-2 py-1 rounded border border-blue-700/30">Review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">Our platform provides all the tools you need to manage projects efficiently and keep your team on the same page.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-950/30 backdrop-blur-sm p-8 rounded-xl shadow-md border border-blue-800/30 hover:shadow-lg hover:shadow-blue-900/20 transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 mb-5">
              <FiLayers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Project Management</h3>
            <p className="text-blue-200">Create and manage projects with ease. Assign team members and track progress in real-time.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Intuitive project dashboard</span>
              </li>
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Role-based permissions</span>
              </li>
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Progress tracking</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-950/30 backdrop-blur-sm p-8 rounded-xl shadow-md border border-blue-800/30 hover:shadow-lg hover:shadow-blue-900/20 transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 mb-5">
              <FiClipboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Task Tracking</h3>
            <p className="text-blue-200">Organize tasks by priority and status. Filter and sort to focus on what matters most.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Priority-based organization</span>
              </li>
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Status updates</span>
              </li>
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Advanced filtering options</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-950/30 backdrop-blur-sm p-8 rounded-xl shadow-md border border-blue-800/30 hover:shadow-lg hover:shadow-blue-900/20 transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 mb-5">
              <FiUsers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Team Collaboration</h3>
            <p className="text-blue-200">Comment on tasks and keep everyone in the loop with real-time updates and notifications.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Task comments</span>
              </li>
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Team member assignments</span>
              </li>
              <li className="flex items-center text-blue-200">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Activity tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900/30 border-t border-blue-800/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isAuthenticated ? 'Continue Your Work' : 'Ready to Get Started?'}
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            {isAuthenticated
              ? 'Access your dashboard to manage your projects and tasks efficiently.'
              : 'Join thousands of teams who use ProjectTaskr to deliver projects on time and within budget.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isAuthenticated && (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 text-lg font-semibold shadow-lg shadow-blue-600/20"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-900/50 text-white hover:bg-blue-800/50 focus:ring-blue-500 text-lg font-semibold border border-blue-700/50"
                >
                  Sign In
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-8 py-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 text-lg font-semibold flex items-center justify-center"
              >
                <FiArrowRight className="mr-2" /> Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
