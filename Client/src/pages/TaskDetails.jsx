import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axiosConfig';
import AuthContext from '../context/AuthContext';
import { FiArrowLeft, FiMessageSquare, FiEdit2, FiTrash2, FiAlertCircle, FiSend, FiCheck, FiX } from 'react-icons/fi';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const fetchTaskAndComments = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        // Fetch task details
        const taskRes = await axios.get(`/tasks/${id}`);
        setTask(taskRes.data.data);

        // Fetch comments for this task
        const commentsRes = await axios.get(`/tasks/${id}/comments`);
        setComments(commentsRes.data.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching task details:', err);
        toast.error('Failed to fetch task details');
        setLoading(false);
        navigate('/dashboard');
      }
    };

    if (!authLoading) {
      fetchTaskAndComments();
    }
  }, [id, navigate, isAuthenticated, authLoading]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const res = await axios.post('/comments', {
        text: newComment,
        task: id
      });

      setComments([res.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(`/tasks/${id}`, {
        status: newStatus
      });

      setTask(res.data.data);
      toast.success('Task status updated');
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
    }
  };

  const startEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.text);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleEditComment = async (e) => {
    e.preventDefault();

    if (!editCommentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const res = await axios.put(`/comments/${editingComment}`, {
        text: editCommentText
      });

      // Update comment in state
      setComments(comments.map(comment =>
        comment._id === editingComment ? res.data.data : comment
      ));

      setEditingComment(null);
      setEditCommentText('');
      toast.success('Comment updated successfully');
    } catch (err) {
      console.error('Error updating comment:', err);
      toast.error(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const confirmDeleteComment = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteConfirm(true);
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/comments/${commentToDelete._id}`);

      // Remove comment from state
      setComments(comments.filter(comment => comment._id !== commentToDelete._id));

      setShowDeleteConfirm(false);
      setCommentToDelete(null);
      toast.success('Comment deleted successfully');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (loading || !task) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-blue-400">Loading task details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-300 hover:text-blue-100 mb-6 flex items-center transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Project
        </button>

        <div className="bg-blue-950/30 backdrop-blur-sm p-6 rounded-xl shadow-md mb-6 border border-blue-800/30">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{task.title}</h1>
              <p className="text-blue-200 mb-4">{task.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.priority === 'High' ? 'bg-red-900/30 text-red-300 border border-red-800/30' :
                task.priority === 'Medium' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/30' :
                'bg-green-900/30 text-green-300 border border-green-800/30'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-blue-200">
            <div className="space-y-3">
              <p>
                <span className="text-blue-300 font-medium">Project:</span> {task.project?.name || 'Unknown Project'}
              </p>
              <p>
                <span className="text-blue-300 font-medium">Assigned To:</span> {task.assignedTo?.name || 'Unassigned'}
              </p>
            </div>
            <div className="space-y-3">
              <p>
                <span className="text-blue-300 font-medium">Created:</span> {new Date(task.createdAt).toLocaleString()}
              </p>
              <div className="flex items-center">
                <span className="text-blue-300 font-medium mr-3">Status:</span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-sm border rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    task.status === 'Pending' ? 'bg-gray-900/30 text-gray-300 border-gray-700' :
                    task.status === 'In Progress' ? 'bg-blue-900/30 text-blue-300 border-blue-700' :
                    'bg-green-900/30 text-green-300 border-green-700'
                  }`}
                  disabled={task.assignedTo?._id !== user?.id && user?.role !== 'admin'}
                >
                  <option value="Pending" className="bg-blue-950 text-gray-300">Pending</option>
                  <option value="In Progress" className="bg-blue-950 text-blue-300">In Progress</option>
                  <option value="Done" className="bg-blue-950 text-green-300">Done</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-950/30 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-800/30">
          <div className="flex items-center mb-6">
            <FiMessageSquare className="text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Comments</h2>
          </div>

          <form onSubmit={handleAddComment} className="mb-8">
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-2" htmlFor="comment">
                Add a Comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                placeholder="Write your comment here..."
                rows="3"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 flex items-center shadow-lg shadow-blue-600/20"
            >
              <FiSend className="mr-2" /> Add Comment
            </button>
          </form>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/30 text-blue-400 mb-4">
                <FiMessageSquare className="w-8 h-8" />
              </div>
              <p className="text-blue-300">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b border-blue-800/30 pb-6">
                  {editingComment === comment._id ? (
                    <form onSubmit={handleEditComment} className="space-y-3">
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-800/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-900/30 text-white placeholder-blue-300/50"
                        rows="3"
                        required
                      ></textarea>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="flex items-center px-3 py-1.5 rounded-md text-sm bg-green-600/70 hover:bg-green-600 text-white transition-colors"
                        >
                          <FiCheck className="mr-1" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditComment}
                          className="flex items-center px-3 py-1.5 rounded-md text-sm bg-gray-700/70 hover:bg-gray-700 text-white transition-colors"
                        >
                          <FiX className="mr-1" /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white">{comment.text}</p>
                        <p className="text-sm text-blue-300 mt-2">
                          By {comment.user?.name || 'Unknown User'} • {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {(user?.id === comment.user?._id || user?.role === 'admin') && (
                        <div className="flex space-x-3 ml-4">
                          <button
                            onClick={() => startEditComment(comment)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center text-sm"
                            aria-label="Edit comment"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteComment(comment)}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center text-sm"
                            aria-label="Delete comment"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment Delete Confirmation Modal */}
      {showDeleteConfirm && commentToDelete && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-900/70 p-6 rounded-xl shadow-lg max-w-md w-full border border-blue-700/50">
            <div className="flex items-center mb-4 text-red-400">
              <FiAlertCircle className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-bold">Delete Comment</h2>
            </div>
            <p className="mb-6 text-blue-200">Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCommentToDelete(null);
                }}
                className="px-4 py-2 rounded-md bg-blue-800/70 hover:bg-blue-800 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
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

export default TaskDetails;
