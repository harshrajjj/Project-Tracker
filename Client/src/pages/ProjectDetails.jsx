import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axiosConfig';
import AuthContext from '../context/AuthContext';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="text-sm text-gray-500">
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={openEditForm}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Project Form */}
        {showEditForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            <form onSubmit={handleEditProject}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                  Project Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editProject.name}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editProject.description}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-red-600">Delete Project</h2>
              <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone and will also delete all tasks associated with this project.</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex space-x-4">
          {isAdmin && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showCreateForm ? 'Cancel' : 'Add Task'}
            </button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Task Title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedTo">
                  Assign To
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={newTask.assignedTo}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Task Description"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Task
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('me')}
              className={`px-3 py-1 rounded ${
                filter === 'me'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              My Tasks
            </button>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded py-1 px-2 text-sm"
            >
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>
        </div>

        {sortedTasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <div key={task._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                {editingTask && editingTask._id === task._id ? (
                  <form onSubmit={handleEditTaskSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">
                          Task Title
                        </label>
                        <input
                          type="text"
                          id="edit-title"
                          name="title"
                          value={editingTask.title}
                          onChange={handleEditTaskChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-assignedTo">
                          Assign To
                        </label>
                        <select
                          id="edit-assignedTo"
                          name="assignedTo"
                          value={editingTask.assignedTo}
                          onChange={handleEditTaskChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        >
                          {users.map(user => (
                            <option key={user._id} value={user._id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-priority">
                          Priority
                        </label>
                        <select
                          id="edit-priority"
                          name="priority"
                          value={editingTask.priority}
                          onChange={handleEditTaskChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">
                          Status
                        </label>
                        <select
                          id="edit-status"
                          name="status"
                          value={editingTask.status}
                          onChange={handleEditTaskChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                        Description
                      </label>
                      <textarea
                        id="edit-description"
                        name="description"
                        value={editingTask.description}
                        onChange={handleEditTaskChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditTask}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          Assigned to: {task.assignedTo.name}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Status:</span>
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                          className={`text-sm border rounded py-1 px-2 ${
                            task.status === 'Pending' ? 'bg-gray-100' :
                            task.status === 'In Progress' ? 'bg-blue-100' :
                            'bg-green-100'
                          }`}
                          disabled={task.assignedTo?._id !== user?.id && !isAdmin}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        {(isAdmin || task.assignedTo?._id === user?.id) && (
                          <>
                            <button
                              onClick={() => startEditTask(task)}
                              className="text-yellow-500 hover:text-yellow-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDeleteTask(task)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => navigate(`/tasks/${task._id}`)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          View Details & Comments
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Task</h2>
            <p className="mb-6">Are you sure you want to delete the task "{taskToDelete.title}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowTaskDeleteConfirm(false);
                  setTaskToDelete(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
