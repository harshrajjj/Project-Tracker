import { Link } from 'react-router-dom';
import { FiCheckCircle, FiUsers, FiClipboard, FiLayers, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Manage Projects & Tasks with Ease
              </h1>
              <p className="text-xl mb-8 text-indigo-100 max-w-xl">
                A comprehensive solution for teams to collaborate, track progress, and deliver projects on time.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="btn bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold flex items-center justify-center"
                >
                  Get Started <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="btn bg-indigo-700 hover:bg-indigo-800 text-white border border-indigo-500 px-6 py-3 rounded-lg font-semibold flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl p-1">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <div className="ml-4 text-sm text-gray-500 font-medium">ProjectTaskr Dashboard</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Active Projects</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">3 Projects</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                              <FiLayers className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-800">Website Redesign</span>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">In Progress</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                              <FiClipboard className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-800">Mobile App Development</span>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Planning</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                              <FiUsers className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-800">Marketing Campaign</span>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Review</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our platform provides all the tools you need to manage projects efficiently and keep your team on the same page.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
              <FiLayers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Project Management</h3>
            <p className="text-gray-600">Create and manage projects with ease. Assign team members and track progress in real-time.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Intuitive project dashboard</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Role-based permissions</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Progress tracking</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
              <FiClipboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Task Tracking</h3>
            <p className="text-gray-600">Organize tasks by priority and status. Filter and sort to focus on what matters most.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Priority-based organization</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Status updates</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Advanced filtering options</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
              <FiUsers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Team Collaboration</h3>
            <p className="text-gray-600">Comment on tasks and keep everyone in the loop with real-time updates and notifications.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Task comments</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Team member assignments</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Activity tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-700 mb-8 max-w-2xl mx-auto">Join thousands of teams who use ProjectTaskr to deliver projects on time and within budget.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="px-8 py-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 text-lg font-semibold"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
