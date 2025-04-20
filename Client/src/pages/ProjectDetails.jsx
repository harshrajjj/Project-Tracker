import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axiosConfig';
import AuthContext from '../context/AuthContext';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiFilter, FiCheck, FiX, FiAlertCircle, FiList, FiCalendar, FiClock, FiFlag, FiUser } from 'react-icons/fi';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'me'
  const [sortBy, setSortBy] = useState('priority'); // 'priority', 'status', 'createdAt'
  const [editProject, setEditProject] = useState({
    name: '',
    description: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskDeleteConfirm, setShowTaskDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: ''
  });

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        // Fetch project details
        const projectRes = await axios.get(`/projects/${id}`);
        setProject(projectRes.data.data);

        // Fetch tasks for this project
        const tasksRes = await axios.get(`/projects/${id}/tasks`);
        setTasks(tasksRes.data.data);

        // Fetch users for assignment (admin only)
        if (isAdmin) {
          try {
            const usersRes = await axios.get('/users');
            setUsers(usersRes.data.data);
          } catch (userErr) {
            console.error('Failed to fetch users:', userErr);
            // Continue even if users fetch fails
          }
        }

        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch project details');
        setLoading(false);
        navigate('/dashboard');
      }
    };

    if (!authLoading) {
      fetchProjectAndTasks();
    }
  }, [id, navigate, isAdmin, isAuthenticated, authLoading]);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTask.title || !newTask.description || !newTask.assignedTo) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const res = await axios.post('/tasks', {
        ...newTask,
        project: id
      });

      setTasks([res.data.data, ...tasks]);
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: ''
      });
      setShowCreateForm(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`/tasks/${taskId}`, {
        status: newStatus
      });

      // Update task in state
      setTasks(tasks.map(task =>
        task._id === taskId ? res.data.data : task
      ));

      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  const handleEditChange = (e) => {
    setEditProject({
      ...editProject,
      [e.target.name]: e.target.value
    });
  };

  const handleEditProject = async (e) => {
    e.preventDefault();

    if (!editProject.name || !editProject.description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.put(`/projects/${id}`, editProject);
      setProject(res.data.data);
      setShowEditForm(false);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const openEditForm = () => {
    setEditProject({
      name: project.name,
      description: project.description
    });
    setShowEditForm(true);
  };

  const startEditTask = (task) => {
    setEditingTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo._id
    });
  };

  const cancelEditTask = () => {
    setEditingTask(null);
  };

  const handleEditTaskChange = (e) => {
    setEditingTask({
      ...editingTask,
      [e.target.name]: e.target.value
    });
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`/tasks/${editingTask._id}`, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        assignedTo: editingTask.assignedTo
      });

      // Update task in state
      setTasks(tasks.map(task =>
        task._id === editingTask._id ? res.data.data : task
      ));

      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowTaskDeleteConfirm(true);
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`/tasks/${taskToDelete._id}`);

      // Remove task from state
      setTasks(tasks.filter(task => task._id !== taskToDelete._id));

      setShowTaskDeleteConfirm(false);
      setTaskToDelete(null);
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Debug user and task information
  useEffect(() => {
    if (filter === 'me' && tasks.length > 0) {
      console.log('Current user:', user);
      console.log('First task assignedTo:', tasks[0].assignedTo);
    }
  }, [filter, tasks, user]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'me') {
      // The issue is here - user.id vs user._id mismatch
      // Check both _id and id to be safe
      return task.assignedTo._id === (user._id || user.id);
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'status') {
      const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Done': 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-blue-400">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-300 hover:text-blue-100 mb-6 flex items-center transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <div className="bg-blue-950/30 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-800/30">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{project.name}</h1>
              <p className="text-blue-200 mb-4">{project.description}</p>
              <div className="flex items-center text-sm text-blue-300">
                <FiCalendar className="mr-2" />
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-3">
                <button
                  onClick={openEditForm}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm bg-yellow-600/70 hover:bg-yellow-600 text-white transition-colors"
                >
                  <FiEdit2 className="mr-1.5" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm bg-red-600/70 hover:bg-red-600 text-white transition-colors"
                >
                  <FiTrash2 className="mr-1.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Project Form */}
        {showEditForm && (
          <div className="bg-blue-950/30 backdrop-blur-sm p-6 rounded-xl shadow-md mt-6 border border-blue-800/30">
            <div className="flex items-center mb-6">
              <FiEdit2 className="text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Edit Project</h2>
            </div>
            <form onSubmit={handleEditProject} className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="edit-name">
                  Project Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editProject.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                  required
                />
              </div>
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="edit-description">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editProject.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600/70 text-white hover:bg-green-600 focus:ring-green-500"
                >
                  <FiCheck className="mr-2" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-800/50 text-white hover:bg-blue-800 focus:ring-blue-500"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-blue-900/70 p-6 rounded-xl shadow-lg max-w-md w-full border border-blue-700/50">
              <div className="flex items-center mb-4 text-red-400">
                <FiAlertCircle className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Delete Project</h2>
              </div>
              <p className="mb-6 text-blue-200">Are you sure you want to delete this project? This action cannot be undone and will also delete all tasks associated with this project.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-md bg-blue-800/70 hover:bg-blue-800 text-white transition-colors flex items-center"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-4 py-2 rounded-md bg-red-600/70 hover:bg-red-600 text-white transition-colors flex items-center"
                >
                  <FiTrash2 className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <FiList className="text-blue-400 mr-3 text-xl" />
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
        </div>
        <div className="flex space-x-4">
          {isAdmin && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${showCreateForm ? 'bg-blue-800/50 text-white hover:bg-blue-700/50 focus:ring-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-600/20'}`}
            >
              {showCreateForm ? (
                <>
                  <FiX className="mr-2" /> Cancel
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" /> Add Task
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-blue-950/30 backdrop-blur-sm p-6 rounded-xl shadow-md mb-8 border border-blue-800/30">
          <div className="flex items-center mb-6">
            <FiPlus className="text-blue-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">Create New Task</h3>
          </div>
          <form onSubmit={handleCreateTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="title">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="assignedTo">
                  <div className="flex items-center">
                    <FiUser className="mr-1" /> Assign To
                  </div>
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={newTask.assignedTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white"
                  required
                >
                  <option value="" className="bg-blue-950">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id} className="bg-blue-950">
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="priority">
                  <div className="flex items-center">
                    <FiFlag className="mr-1" /> Priority
                  </div>
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white"
                >
                  <option value="Low" className="bg-blue-950 text-green-300">Low</option>
                  <option value="Medium" className="bg-blue-950 text-yellow-300">Medium</option>
                  <option value="High" className="bg-blue-950 text-red-300">High</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="status">
                  <div className="flex items-center">
                    <FiClock className="mr-1" /> Status
                  </div>
                </label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white"
                >
                  <option value="Pending" className="bg-blue-950 text-gray-300">Pending</option>
                  <option value="In Progress" className="bg-blue-950 text-blue-300">In Progress</option>
                  <option value="Done" className="bg-blue-950 text-green-300">Done</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                  placeholder="Describe the task in detail"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600/70 text-white hover:bg-green-600 focus:ring-green-500 flex items-center shadow-lg shadow-green-600/20"
              >
                <FiPlus className="mr-2" /> Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-blue-950/30 backdrop-blur-sm rounded-xl shadow-md p-6 border border-blue-800/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-3 mb-4 md:mb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600/70 text-white'
                  : 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50 hover:text-blue-200'
              }`}
            >
              <FiList className="mr-1.5" /> All Tasks
            </button>
            <button
              onClick={() => setFilter('me')}
              className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors ${
                filter === 'me'
                  ? 'bg-blue-600/70 text-white'
                  : 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50 hover:text-blue-200'
              }`}
            >
              <FiUser className="mr-1.5" /> My Tasks
            </button>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-blue-300 flex items-center">
              <FiFilter className="mr-1.5" /> Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-blue-800/50 rounded-md py-1.5 px-3 text-sm bg-blue-900/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="priority" className="bg-blue-950">Priority</option>
              <option value="status" className="bg-blue-950">Status</option>
              <option value="createdAt" className="bg-blue-950">Date Created</option>
            </select>
          </div>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/30 text-blue-400 mb-4">
              <FiList className="w-8 h-8" />
            </div>
            <p className="text-blue-300">No tasks found. {isAdmin && 'Create a new task to get started!'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <div key={task._id} className="border border-blue-800/30 rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-900/20 backdrop-blur-sm">
                {editingTask && editingTask._id === task._id ? (
                  <form onSubmit={handleEditTaskSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="edit-title">
                          Task Title
                        </label>
                        <input
                          type="text"
                          id="edit-title"
                          name="title"
                          value={editingTask.title}
                          onChange={handleEditTaskChange}
                          className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="edit-assignedTo">
                          <div className="flex items-center">
                            <FiUser className="mr-1" /> Assign To
                          </div>
                        </label>
                        <select
                          id="edit-assignedTo"
                          name="assignedTo"
                          value={editingTask.assignedTo}
                          onChange={handleEditTaskChange}
                          className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white"
                          required
                        >
                          {users.map(user => (
                            <option key={user._id} value={user._id} className="bg-blue-950">
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="edit-priority">
                          <div className="flex items-center">
                            <FiFlag className="mr-1" /> Priority
                          </div>
                        </label>
                        <select
                          id="edit-priority"
                          name="priority"
                          value={editingTask.priority}
                          onChange={handleEditTaskChange}
                          className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white"
                        >
                          <option value="Low" className="bg-blue-950 text-green-300">Low</option>
                          <option value="Medium" className="bg-blue-950 text-yellow-300">Medium</option>
                          <option value="High" className="bg-blue-950 text-red-300">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="edit-status">
                          <div className="flex items-center">
                            <FiClock className="mr-1" /> Status
                          </div>
                        </label>
                        <select
                          id="edit-status"
                          name="status"
                          value={editingTask.status}
                          onChange={handleEditTaskChange}
                          className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white"
                        >
                          <option value="Pending" className="bg-blue-950 text-gray-300">Pending</option>
                          <option value="In Progress" className="bg-blue-950 text-blue-300">In Progress</option>
                          <option value="Done" className="bg-blue-950 text-green-300">Done</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="edit-description">
                        Description
                      </label>
                      <textarea
                        id="edit-description"
                        name="description"
                        value={editingTask.description}
                        onChange={handleEditTaskChange}
                        className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex items-center px-3 py-1.5 rounded-md text-sm bg-green-600/70 hover:bg-green-600 text-white transition-colors"
                      >
                        <FiCheck className="mr-1.5" /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditTask}
                        className="flex items-center px-3 py-1.5 rounded-md text-sm bg-blue-800/50 hover:bg-blue-800 text-white transition-colors"
                      >
                        <FiX className="mr-1.5" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                        <p className="text-blue-200 mt-1">{task.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-900/30 text-red-300 border border-red-800/30' :
                          task.priority === 'Medium' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/30' :
                          'bg-green-900/30 text-green-300 border border-green-800/30'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-sm text-blue-300 mt-2 flex items-center">
                          <FiUser className="mr-1.5 text-xs" /> {task.assignedTo.name}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center">
                        <span className="text-sm text-blue-300 mr-2 flex items-center">
                          <FiClock className="mr-1.5" /> Status:
                        </span>
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                          className={`text-sm border rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            task.status === 'Pending' ? 'bg-gray-900/30 text-gray-300 border-gray-700' :
                            task.status === 'In Progress' ? 'bg-blue-900/30 text-blue-300 border-blue-700' :
                            'bg-green-900/30 text-green-300 border-green-700'
                          }`}
                          disabled={task.assignedTo?._id !== user?.id && !isAdmin}
                        >
                          <option value="Pending" className="bg-blue-950 text-gray-300">Pending</option>
                          <option value="In Progress" className="bg-blue-950 text-blue-300">In Progress</option>
                          <option value="Done" className="bg-blue-950 text-green-300">Done</option>
                        </select>
                      </div>
                      <div className="flex space-x-3">
                        {(isAdmin || task.assignedTo?._id === user?.id) && (
                          <>
                            <button
                              onClick={() => startEditTask(task)}
                              className="flex items-center px-2.5 py-1 rounded-md text-xs bg-yellow-600/50 hover:bg-yellow-600/70 text-white transition-colors"
                            >
                              <FiEdit2 className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => confirmDeleteTask(task)}
                              className="flex items-center px-2.5 py-1 rounded-md text-xs bg-red-600/50 hover:bg-red-600/70 text-white transition-colors"
                            >
                              <FiTrash2 className="mr-1" /> Delete
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => navigate(`/tasks/${task._id}`)}
                          className="flex items-center px-2.5 py-1 rounded-md text-xs bg-blue-600/50 hover:bg-blue-600/70 text-white transition-colors"
                        >
                          <FiList className="mr-1" /> View Details
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Delete Confirmation Modal */}
      {showTaskDeleteConfirm && taskToDelete && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-900/70 p-6 rounded-xl shadow-lg max-w-md w-full border border-blue-700/50">
            <div className="flex items-center mb-4 text-red-400">
              <FiAlertCircle className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-bold">Delete Task</h2>
            </div>
            <p className="mb-6 text-blue-200">Are you sure you want to delete the task "{taskToDelete.title}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTaskDeleteConfirm(false);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 rounded-md bg-blue-800/70 hover:bg-blue-800 text-white transition-colors flex items-center"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 rounded-md bg-red-600/70 hover:bg-red-600 text-white transition-colors flex items-center"
              >
                <FiTrash2 className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
