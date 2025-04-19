import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axiosConfig';
import AuthContext from '../context/AuthContext';
import { FiPlus, FiX, FiFolder, FiClock, FiCalendar, FiChevronRight } from 'react-icons/fi';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 0
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const fetchProjects = async (page = 1) => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    try {
      console.log(`Dashboard: Fetching projects for page ${page}...`);
      const res = await axios.get(`/projects?page=${page}&limit=${pagination.limit}`);
      console.log('Dashboard: Projects fetched successfully:', res.data);
      setProjects(res.data.data);
      setPagination({
        ...pagination,
        page,
        total: res.data.pagination.total,
        pages: res.data.pagination.pages
      });
      setLoading(false);
    } catch (err) {
      console.error('Dashboard: Error fetching projects:', err);
      setError('Failed to fetch projects. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProjects(pagination.page);
    }
  }, [isAuthenticated, authLoading, pagination.limit]); // eslint-disable-line react-hooks/exhaustive-deps

  // This effect will run when the component mounts and when isAuthenticated changes
  useEffect(() => {
    console.log('Dashboard: Auth state changed - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);
  }, [isAuthenticated, authLoading]);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!newProject.name || !newProject.description) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post('/projects', newProject);

      // Reset form and hide it
      setNewProject({ name: '', description: '' });
      setShowCreateForm(false);

      // Success message
      console.log('Project created successfully');

      // Refresh projects list
      fetchProjects(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-indigo-500">Loading your projects...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-700 hover:bg-red-100 p-1 rounded-full"
            aria-label="Dismiss"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Projects Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and track all your projects in one place</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                if (showCreateForm) {
                  setNewProject({ name: '', description: '' });
                }
              }}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${showCreateForm ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'}`}
            >
              {showCreateForm ? (
                <>
                  <FiX className="mr-2" /> Cancel
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" /> Create Project
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200 slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewProject({ name: '', description: '' });
              }}
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full"
              aria-label="Close form"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateProject}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProject.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProject.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the project purpose and goals"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewProject({ name: '', description: '' });
                }}
                className="px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 flex items-center"
              >
                <FiPlus className="mr-2" /> Create Project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pagination.total} {pagination.total === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <FiFolder className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {isAdmin
                ? "Get started by creating your first project using the 'Create Project' button above."
                : "You don't have any projects assigned to you yet."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 flex items-center mx-auto"
              >
                <FiPlus className="mr-2" /> Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {projects.map((project) => (
                <Link
                  to={`/projects/${project._id}`}
                  key={project._id}
                  className="group block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 card-hover"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <FiFolder className="w-5 h-5" />
                      </div>
                      <div className="flex items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <span className="mr-1 text-sm">View</span>
                        <FiChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <div className="flex items-center">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="w-3 h-3 mr-1" />
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center py-6 border-t border-gray-200 bg-gray-50">
                <nav className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => fetchProjects(1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-2 rounded-l-md border ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    First
                  </button>
                  <button
                    onClick={() => fetchProjects(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-2 border-t border-b ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    Prev
                  </button>
                  <span className="px-3 py-2 border-t border-b bg-indigo-50 text-indigo-600 font-medium">
                    {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchProjects(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`px-3 py-2 border-t border-b ${pagination.page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => fetchProjects(pagination.pages)}
                    disabled={pagination.page === pagination.pages}
                    className={`px-3 py-2 rounded-r-md border ${pagination.page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    Last
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
